import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query',
      },
    ],
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Log query duration during local development only.
// if (process.env.NODE_ENV !== 'production') {
  prisma.$on('query', (event) => {
    console.log('[Prisma Query]', {
      durationMs: event.duration,
      query: event.query,
    });
  });
// }

export default prisma;