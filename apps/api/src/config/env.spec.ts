import { describe, expect, it } from "@jest/globals";
import { envSchema, runtimeEnvSchema } from "@repo/validation";

describe("envSchema", () => {
  it("accepts a valid runtime configuration without DIRECT_URL", () => {
    const env = runtimeEnvSchema.parse({
      DATABASE_URL:
        "postgresql://postgres:postgres@localhost:5432/health_tracker",
      SUPABASE_URL: "https://project.supabase.co",
      SUPABASE_JWKS_URL:
        "https://project.supabase.co/auth/v1/.well-known/jwks.json",
    });

    expect(env.PORT).toBe(3000);
    expect(env.API_PREFIX).toBe("api");
    expect(env.SUPABASE_JWT_AUDIENCE).toBe("authenticated");
  });

  it("rejects a runtime configuration without a JWKS URL", () => {
    expect(() =>
      runtimeEnvSchema.parse({
        DATABASE_URL:
          "postgresql://postgres:postgres@localhost:5432/health_tracker",
        SUPABASE_URL: "https://project.supabase.co",
      }),
    ).toThrow();
  });

  it("requires DIRECT_URL for the full Prisma CLI schema", () => {
    expect(() =>
      envSchema.parse({
        DATABASE_URL:
          "postgresql://postgres:postgres@localhost:5432/health_tracker",
        SUPABASE_URL: "https://project.supabase.co",
        SUPABASE_JWKS_URL:
          "https://project.supabase.co/auth/v1/.well-known/jwks.json",
      }),
    ).toThrow();
  });
});
