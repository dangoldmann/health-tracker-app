import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { generateKeyPairSync } from "node:crypto";
import type { JsonWebKey } from "node:crypto";
import { sign } from "jsonwebtoken";
import type { Server } from "node:http";
import request from "supertest";

import { AppModule } from "../../src/app.module";
import { PrismaService } from "../../src/prisma/prisma.service";

describe("Auth E2E", () => {
  let app: INestApplication;
  let privateKey: string;
  let publicJwk: JsonWebKey;
  let originalFetch: typeof global.fetch;

  const prismaServiceMock = {
    user: {
      findUnique: jest.fn(),
    },
  };

  beforeAll(async () => {
    const keyPair = generateKeyPairSync("rsa", {
      modulusLength: 2048,
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
      publicKeyEncoding: {
        format: "jwk",
      },
    });

    privateKey = keyPair.privateKey;
    publicJwk = keyPair.publicKey;
    originalFetch = global.fetch;
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            keys: [
              {
                ...publicJwk,
                kid: "test-key-id",
                use: "sig",
                alg: "RS256",
              },
            ],
          }),
      }),
    ) as typeof global.fetch;

    process.env.DATABASE_URL =
      process.env.DATABASE_URL ??
      "postgresql://postgres:postgres@localhost:5432/health_tracker";
    process.env.SUPABASE_URL = "https://project.supabase.co";
    process.env.SUPABASE_JWT_AUDIENCE = "authenticated";
    process.env.SUPABASE_JWT_ISSUER = "https://project.supabase.co/auth/v1";
    process.env.SUPABASE_JWKS_URL =
      "https://project.supabase.co/auth/v1/.well-known/jwks.json";

      const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaServiceMock)
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix("api");
    await app.init();
  });

  beforeEach(() => {
    prismaServiceMock.user.findUnique.mockReset();
    prismaServiceMock.user.findUnique.mockResolvedValue(null);
  });

  afterAll(async () => {
    await app.close();
    global.fetch = originalFetch;
  });

  it("rejects requests without a bearer token", async () => {
    const httpServer = app.getHttpServer() as Server;

    await request(httpServer).get("/api/auth/me").expect(401);
  });

  it("rejects requests with an invalid bearer token", async () => {
    const httpServer = app.getHttpServer() as Server;

    await request(httpServer)
      .get("/api/auth/me")
      .set("Authorization", "Bearer invalid-token")
      .expect(401);
  });

  it("returns token identity and null user when no app user exists", async () => {
    const httpServer = app.getHttpServer() as Server;
    const token = await signAccessToken(privateKey, {
      sub: "c4d984cf-b5da-4df8-a1c3-6914bf0fca9c",
      email: "user@example.com",
    });

    await request(httpServer)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          id: "c4d984cf-b5da-4df8-a1c3-6914bf0fca9c",
          email: "user@example.com",
          user: null,
        });
      });
  });

  it("returns the persisted app user when it exists", async () => {
    const createdAt = new Date("2026-01-01T10:00:00.000Z");
    const updatedAt = new Date("2026-01-02T10:00:00.000Z");
    const httpServer = app.getHttpServer() as Server;
    const token = await signAccessToken(privateKey, {
      sub: "6bb95626-c070-4300-a655-5f32ff428794",
      email: "user@example.com",
    });

    prismaServiceMock.user.findUnique.mockResolvedValue({
      id: "6bb95626-c070-4300-a655-5f32ff428794",
      createdAt,
      updatedAt,
    });

    await request(httpServer)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          id: "6bb95626-c070-4300-a655-5f32ff428794",
          email: "user@example.com",
          user: {
            id: "6bb95626-c070-4300-a655-5f32ff428794",
            createdAt: createdAt.toISOString(),
            updatedAt: updatedAt.toISOString(),
          },
        });
      });
  });
});

async function signAccessToken(
  privateKey: string,
  input: {
    sub: string;
    email?: string;
  },
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    sign(
      {
        email: input.email,
        role: "authenticated",
      },
      privateKey,
      {
        algorithm: "RS256",
        keyid: "test-key-id",
        subject: input.sub,
        audience: "authenticated",
        issuer: "https://project.supabase.co/auth/v1",
        expiresIn: "5m",
      },
      (error, token) => {
        if (error || !token) {
          reject(error ?? new Error("JWT signing returned no token."));
          return;
        }

        resolve(token);
      },
    );
  });
}
