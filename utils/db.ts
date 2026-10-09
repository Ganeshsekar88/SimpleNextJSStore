import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured');
  }

  const adapter = new PrismaPg({
    connectionString,
  });

  return new PrismaClient({
    adapter,
    log: [
      {
        emit: 'event',
        level: 'query',
      },
    ],
  });
};

type PrismaClientSingleton = ReturnType<
  typeof prismaClientSingleton
>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

console.log('[Prisma Diagnostic] Client module initialized', {
  environment: process.env.NODE_ENV,
});

prisma.$on('query', (event) => {
  console.log('[Prisma Diagnostic] Query event received', {
    durationMs: event.duration,
    query: event.query,
  });
});

export default prisma;