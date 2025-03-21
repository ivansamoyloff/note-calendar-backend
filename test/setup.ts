import { config } from 'dotenv';
config({ path: '.env.test' });

import { PrismaService } from '../src/prisma/prisma.service';
import { cleanupDatabase } from './utils/test-prisma-cleanup';

export default async () => {
  const prisma = new PrismaService();
  await cleanupDatabase(prisma);
};
