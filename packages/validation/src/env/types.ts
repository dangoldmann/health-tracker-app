import z from "zod";
import { envSchema, runtimeEnvSchema } from "./schemas";

export type AppEnv = z.infer<typeof envSchema>;
export type RuntimeAppEnv = z.infer<typeof runtimeEnvSchema>;
