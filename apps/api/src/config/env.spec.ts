import { describe, expect, it } from "@jest/globals";
import { envSchema } from "@repo/validation";

describe("envSchema", () => {
  it("accepts a valid JWKS-based configuration", () => {
    const env = envSchema.parse({
      DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/health_tracker",
      DIRECT_URL: "postgresql://postgres:postgres@localhost:5432/health_tracker",
      SUPABASE_URL: "https://project.supabase.co",
      SUPABASE_JWKS_URL:
        "https://project.supabase.co/auth/v1/.well-known/jwks.json",
    });

    expect(env.PORT).toBe(3000);
    expect(env.API_PREFIX).toBe("api");
    expect(env.SUPABASE_JWT_AUDIENCE).toBe("authenticated");
  });

  it("rejects a configuration without a JWKS URL", () => {
    expect(() =>
      envSchema.parse({
        DATABASE_URL:
          "postgresql://postgres:postgres@localhost:5432/health_tracker",
        DIRECT_URL:
          "postgresql://postgres:postgres@localhost:5432/health_tracker",
        SUPABASE_URL: "https://project.supabase.co",
      }),
    ).toThrow();
  });
});
