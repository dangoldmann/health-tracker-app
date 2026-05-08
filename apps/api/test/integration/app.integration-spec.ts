import { beforeAll, describe, expect, it } from "@jest/globals";
import { TestingModule, Test } from "@nestjs/testing";

import { AppController } from "../../src/app.controller";
import { AppModule } from "../../src/app.module";
import { AppService } from "../../src/app.service";

describe("AppModule integration", () => {
  let moduleRef: TestingModule;
  let appController: AppController;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    appController = moduleRef.get(AppController);
  });

  it("wires AppController and AppService through Nest DI", () => {
    const appService = moduleRef.get(AppService);

    expect(appController).toBeInstanceOf(AppController);
    expect(appService).toBeInstanceOf(AppService);
    expect(appController.getExample()).toEqual({
      message: "API skeleton is running",
    });
  });
});
