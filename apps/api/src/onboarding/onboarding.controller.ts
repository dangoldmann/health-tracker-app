import {
  Body,
  Controller,
  HttpCode,
  Inject,
  Post,
  UseGuards,
} from "@nestjs/common";
import { finalizeOnboardingRequestSchema } from "@repo/validation";

import { User } from "../auth/decorators/user.decorator";
import { AuthGuard } from "../auth/guards/auth.guard";
import type { AuthenticatedUser } from "../auth/interfaces/authenticated-user.interface";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { FinalizeOnboardingRequestDto } from "./dto/finalize-onboarding-request.dto";
import { FinalizeOnboardingResponseDto } from "./dto/finalize-onboarding-response.dto";
import { OnboardingService } from "./onboarding.service";

@Controller("onboarding")
export class OnboardingController {
  constructor(
    @Inject(OnboardingService)
    private readonly onboardingService: OnboardingService,
  ) {}

  @Post("finalize")
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async finalize(
    @User() authenticatedUser: AuthenticatedUser,
    @Body(new ZodValidationPipe(finalizeOnboardingRequestSchema))
    request: FinalizeOnboardingRequestDto,
  ): Promise<FinalizeOnboardingResponseDto> {
    return this.onboardingService.finalize(authenticatedUser, request);
  }
}
