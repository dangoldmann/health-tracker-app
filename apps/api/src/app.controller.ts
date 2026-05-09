import { Controller, Get, Inject } from "@nestjs/common";

import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(@Inject(AppService) private readonly appService: AppService) {}

  @Get("example")
  getExample(): { message: string } {
    return this.appService.getExample();
  }
}
