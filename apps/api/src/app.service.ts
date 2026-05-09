import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getExample(): { message: string } {
    return {
      message: "API skeleton is running",
    };
  }
}
