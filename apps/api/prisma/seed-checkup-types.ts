import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { checkupTypeCatalog } from "@repo/validation";
import { PrismaClient } from "../src/generated/prisma/client";
import { randomUUID } from "node:crypto";

async function main(): Promise<void> {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required to seed checkup types.");
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({
      connectionString,
    }),
  });

  try {
    for (const checkupType of checkupTypeCatalog) {
      await prisma.checkupType.upsert({
        where: {
          slug: checkupType.slug,
        },
        update: {
          name: checkupType.name,
          isActive: true,
        },
        create: {
          id: randomUUID(),
          slug: checkupType.slug,
          name: checkupType.name,
          isActive: true,
        },
      });
    }
  } finally {
    await prisma.$disconnect();
  }
}

void main();
