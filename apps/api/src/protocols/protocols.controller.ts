import { Controller, Get, Query } from "@nestjs/common";
import {
  GenerateSuggestionsQuery,
  generateSuggestionsQuerySchema,
} from "@repo/validation";

import type { ActiveUser } from "../auth/types/active-user.type";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { ProtocolsService } from "./protocols.service";

@Controller("protocols")
export class ProtocolsController {
  constructor(private readonly protocolsService: ProtocolsService) {}

  @Get("generate-suggestions")
  generateSuggestions(
    @CurrentUser() activeUser: ActiveUser,
    @Query(new ZodValidationPipe(generateSuggestionsQuerySchema))
    query: GenerateSuggestionsQuery,
  ) {
    return this.protocolsService.generateSuggestions(
      activeUser.userId,
      query.profileIds,
    );
  }
}
