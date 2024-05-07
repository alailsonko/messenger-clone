import { PrismaClient } from '@prisma/client';
import { readReplicas } from '@prisma/extension-read-replicas';

const prisma = new PrismaClient().$extends(
  readReplicas({
    url: [
      'postgresql://postgres:postgres@database-replica-mc:5432/postgres?schema=public&connection_limit=30&pool_timeout=60',
    ],
  }),
);

prisma.$connect();

export { prisma };
