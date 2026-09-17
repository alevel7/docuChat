
import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg'

// 1. Setup the adapter
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
// 2. Initialize Prisma with the adapter
const prisma = new PrismaClient({ adapter })

// 3. export glopal prisma api
export default prisma

// if (process.env.NODE_ENV !== "production") {
//   globalForPrisma.prisma = prisma;
// }

export const connectDatabase = async (): Promise<void> => {
  await prisma.$connect();
};

export const disconnectDatabase = async (): Promise<void> => {
  await prisma.$disconnect();
};



