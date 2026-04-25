import { config as loadEnv } from "dotenv";
import { fileURLToPath } from "node:url";
import { defineConfig } from "prisma/config";

loadEnv({
  path: fileURLToPath(new URL(".env", import.meta.url)),
});

function getPrismaCliDatabaseUrl() {
  return (
    process.env.DIRECT_URL ??
    process.env.DATABASE_URL ??
    "postgresql://postgres:postgres@localhost:5432/health_tracker?schema=public"
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: getPrismaCliDatabaseUrl(),
  },
});
