import z from "zod";
import {
  appUserResponseSchema,
  authTokenClaimsSchema,
  getMeResponseSchema,
} from "./schemas";

export type AuthTokenClaims = z.infer<typeof authTokenClaimsSchema>;
export type AppUserResponse = z.infer<typeof appUserResponseSchema>;
export type GetMeResponse = z.infer<typeof getMeResponseSchema>;
