import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getMeResponseSchema } from "./schemas";

describe("auth validation", () => {
  it("accepts a valid get me response payload", () => {
    const result = getMeResponseSchema.parse({
      id: "user_123",
      email: "user@example.com",
      user: {
        id: "app_user_123",
        createdAt: "2026-01-01T10:00:00.000Z",
        updatedAt: "2026-01-02T10:00:00.000Z",
      },
    });

    assert.equal(result.id, "user_123");
    assert.equal(result.user?.createdAt, "2026-01-01T10:00:00.000Z");
  });

  it("allows null user and null email", () => {
    const result = getMeResponseSchema.parse({
      id: "user_456",
      email: null,
      user: null,
    });

    assert.equal(result.email, null);
    assert.equal(result.user, null);
  });
});
