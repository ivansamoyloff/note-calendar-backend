import { PrismaClient } from '@prisma/client';

export async function cleanupDatabase(prisma: PrismaClient) {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('cleanupDatabase can only be used in test environment');
  }

  const tables = await prisma.$queryRaw<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public';
  `;

  for (const { tablename } of tables) {
    if (tablename !== '_prisma_migrations') {
      await prisma.$executeRawUnsafe(
        `TRUNCATE TABLE "${tablename}" RESTART IDENTITY CASCADE`,
      );
    }
  }
}
