import z from "zod";
import { authTokenClaimsSchema } from "./schemas";

export type AuthTokenClaims = z.infer<typeof authTokenClaimsSchema>;
