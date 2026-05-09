import { describe, expect, it } from "@jest/globals";
import { authTokenClaimsSchema } from "@repo/validation";

describe("authTokenClaimsSchema", () => {
  it("accepts valid Supabase token claims", () => {
    const claims = authTokenClaimsSchema.parse({
      sub: "9d01f0c9-1256-4bd4-8d26-ee610ed161e2",
      aud: "authenticated",
      iss: "https://project.supabase.co/auth/v1",
      email: "user@example.com",
    });

    expect(claims.sub).toBe("9d01f0c9-1256-4bd4-8d26-ee610ed161e2");
    expect(claims.email).toBe("user@example.com");
  });

  it("rejects claims without a subject", () => {
    expect(() =>
      authTokenClaimsSchema.parse({
        email: "user@example.com",
      }),
    ).toThrow();
  });
});
