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

describe("Onboarding E2E", () => {
  let app: INestApplication;
  let privateKey: string;
  let publicJwk: JsonWebKey;
  let originalFetch: typeof global.fetch;

  const prismaServiceMock = {
    $transaction: jest.fn(),
  };

  const transactionMock = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    userProfile: {
      count: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
    checkupType: {
      findMany: jest.fn(),
    },
    profile: {
      create: jest.fn(),
    },
    profileCheckup: {
      create: jest.fn(),
    },
    checkupRecord: {
      create: jest.fn(),
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

    prismaServiceMock.$transaction.mockImplementation(
      async (
        callback: (transaction: typeof transactionMock) => Promise<unknown>,
      ) => callback(transactionMock),
    );

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
    jest.clearAllMocks();

    prismaServiceMock.$transaction.mockImplementation(
      async (
        callback: (transaction: typeof transactionMock) => Promise<unknown>,
      ) => callback(transactionMock),
    );

    transactionMock.user.findUnique.mockResolvedValue(null);
    transactionMock.user.create.mockResolvedValue({
      id: "app-user-id",
      authUserId: "auth-user-id",
      email: "user@example.com",
      expoPushToken: "ExponentPushToken[abc]",
    });
    transactionMock.user.update.mockResolvedValue({
      id: "app-user-id",
      authUserId: "auth-user-id",
      email: "user@example.com",
      expoPushToken: "ExponentPushToken[abc]",
    });
    transactionMock.userProfile.count.mockResolvedValue(0);
    transactionMock.checkupType.findMany.mockResolvedValue([
      {
        id: "dentistry-id",
        slug: "dentistry",
      },
      {
        id: "cardiology-id",
        slug: "cardiology",
      },
      {
        id: "pediatrics-id",
        slug: "pediatrics",
      },
    ]);
    transactionMock.profile.create
      .mockResolvedValueOnce({
        id: "self-profile-id",
      })
      .mockResolvedValueOnce({
        id: "parent-profile-id",
      });
    transactionMock.userProfile.create.mockResolvedValue({
      id: "user-profile-link-id",
    });
    transactionMock.profileCheckup.create
      .mockResolvedValueOnce({
        id: "self-dentistry-checkup-id",
      })
      .mockResolvedValueOnce({
        id: "self-cardiology-checkup-id",
      })
      .mockResolvedValueOnce({
        id: "parent-cardiology-checkup-id",
      });
    transactionMock.checkupRecord.create.mockResolvedValue({
      id: "checkup-record-id",
    });
    transactionMock.userProfile.findMany.mockResolvedValue([
      {
        profile: {
          id: "self-profile-id",
          name: "Me",
          relationship: "SELF",
          checkups: [
            {
              id: "self-dentistry-checkup-id",
              checkupType: {
                slug: "dentistry",
              },
            },
            {
              id: "self-cardiology-checkup-id",
              checkupType: {
                slug: "cardiology",
              },
            },
          ],
        },
      },
      {
        profile: {
          id: "parent-profile-id",
          name: "Dad",
          relationship: "PARENT",
          checkups: [
            {
              id: "parent-cardiology-checkup-id",
              checkupType: {
                slug: "cardiology",
              },
            },
          ],
        },
      },
    ]);
  });

  afterAll(async () => {
    await app.close();
    global.fetch = originalFetch;
  });

  it("rejects unauthenticated finalize requests", async () => {
    const httpServer = app.getHttpServer() as Server;

    await request(httpServer).post("/api/onboarding/finalize").expect(401);
  });

  it("returns validation errors for malformed relationship health info", async () => {
    const httpServer = app.getHttpServer() as Server;
    const token = await signAccessToken(privateKey, {
      sub: "auth-user-id",
      email: "user@example.com",
    });

    await request(httpServer)
      .post("/api/onboarding/finalize")
      .set("Authorization", `Bearer ${token}`)
      .send({
        profiles: [
          {
            relationship: "SELF",
            name: "Me",
            birthDate: "1990-05-15",
            healthInfo: {
              concerns: {
                hasDiabetes: true,
              },
            },
            checkups: [
              {
                checkupTypeSlug: "dentistry",
                frequencyDays: 180,
              },
            ],
          },
        ],
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body.message).toBe("Validation failed.");
        expect(body.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: "profiles.0.healthInfo.riskFactors",
            }),
          ]),
        );
      });
  });

  it("rejects duplicate checkup types within the same profile", async () => {
    const httpServer = app.getHttpServer() as Server;
    const token = await signAccessToken(privateKey, {
      sub: "auth-user-id",
      email: "user@example.com",
    });

    await request(httpServer)
      .post("/api/onboarding/finalize")
      .set("Authorization", `Bearer ${token}`)
      .send({
        profiles: [
          {
            relationship: "SELF",
            name: "Me",
            birthDate: "1990-05-15",
            healthInfo: {
              riskFactors: {
                smoker: false,
                hasHypertension: true,
                hasFamilyHistory: false,
              },
            },
            checkups: [
              {
                checkupTypeSlug: "dentistry",
                frequencyDays: 180,
              },
              {
                checkupTypeSlug: "dentistry",
                frequencyDays: 365,
              },
            ],
          },
        ],
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: "profiles.0.checkups.1.checkupTypeSlug",
            }),
          ]),
        );
      });
  });

  it("persists onboarding for mixed profile types and returns stable ids", async () => {
    const httpServer = app.getHttpServer() as Server;
    const token = await signAccessToken(privateKey, {
      sub: "auth-user-id",
      email: "user@example.com",
    });

    await request(httpServer)
      .post("/api/onboarding/finalize")
      .set("Authorization", `Bearer ${token}`)
      .send({
        expoPushToken: "ExponentPushToken[abc]",
        profiles: [
          {
            relationship: "SELF",
            name: "Me",
            birthDate: "1990-05-15",
            biologicalSex: "MALE",
            healthInfo: {
              riskFactors: {
                smoker: false,
                hasHypertension: true,
                hasFamilyHistory: false,
              },
            },
            checkups: [
              {
                checkupTypeSlug: "dentistry",
                frequencyDays: 180,
                initialRecord: {
                  performedAt: "2025-10-10",
                },
              },
              {
                checkupTypeSlug: "cardiology",
                frequencyDays: 365,
              },
            ],
          },
          {
            relationship: "PARENT",
            name: "Dad",
            birthDate: "1958-03-20",
            healthInfo: {
              concerns: {
                hasDiabetes: true,
                hasMobilityIssues: false,
                hasCognitiveConcerns: false,
              },
            },
            checkups: [
              {
                checkupTypeSlug: "cardiology",
                frequencyDays: 180,
              },
            ],
          },
        ],
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          userId: "app-user-id",
          status: "created",
          alreadyFinalized: false,
          profiles: [
            {
              id: "self-profile-id",
              name: "Me",
              relationship: "SELF",
              checkups: [
                {
                  id: "self-dentistry-checkup-id",
                  checkupTypeSlug: "dentistry",
                },
                {
                  id: "self-cardiology-checkup-id",
                  checkupTypeSlug: "cardiology",
                },
              ],
            },
            {
              id: "parent-profile-id",
              name: "Dad",
              relationship: "PARENT",
              checkups: [
                {
                  id: "parent-cardiology-checkup-id",
                  checkupTypeSlug: "cardiology",
                },
              ],
            },
          ],
        });
      });
  });

  it("returns the existing onboarding result for idempotent retries", async () => {
    const httpServer = app.getHttpServer() as Server;
    const token = await signAccessToken(privateKey, {
      sub: "auth-user-id",
      email: "user@example.com",
    });

    transactionMock.user.findUnique.mockResolvedValue({
      id: "app-user-id",
      authUserId: "auth-user-id",
      email: "user@example.com",
      expoPushToken: null,
    });
    transactionMock.userProfile.count.mockResolvedValue(2);

    await request(httpServer)
      .post("/api/onboarding/finalize")
      .set("Authorization", `Bearer ${token}`)
      .send({
        profiles: [
          {
            relationship: "SELF",
            name: "Me",
            birthDate: "1990-05-15",
            healthInfo: {
              riskFactors: {
                smoker: false,
                hasHypertension: true,
                hasFamilyHistory: false,
              },
            },
            checkups: [
              {
                checkupTypeSlug: "dentistry",
                frequencyDays: 180,
              },
            ],
          },
        ],
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.status).toBe("existing");
        expect(body.alreadyFinalized).toBe(true);
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
