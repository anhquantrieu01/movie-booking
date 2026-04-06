import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL!;

// Tạo adapter PrismaPg
const adapter = new PrismaPg({ connectionString });

// Singleton PrismaClient
let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({ adapter });
} else {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  if (!global.prisma) global.prisma = new PrismaClient({ adapter });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  prisma = global.prisma;
}

export { prisma };