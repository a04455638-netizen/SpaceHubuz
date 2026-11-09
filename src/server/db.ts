import { PrismaClient } from "@prisma/client";

const globalDb = globalThis as typeof globalThis & {
  spacehubDb?: PrismaClient;
};

export function getDatabase() {
  if (!process.env.DATABASE_URL) return null;

  globalDb.spacehubDb ??= new PrismaClient();
  return globalDb.spacehubDb;
}
