import { describe, expect, it } from "@jest/globals";

import { AppService } from "./app.service";

describe("AppService", () => {
  it("returns the example payload", () => {
    const service = new AppService();

    expect(service.getExample()).toEqual({
      message: "API skeleton is running",
    });
  });
});
