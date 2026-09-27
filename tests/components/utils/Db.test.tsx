describe('Prisma client singleton', () => {
  const mockPrismaClient = {
    user: {},
    product: {},
  };

  let PrismaClientMock: jest.Mock;

  beforeEach(() => {
    jest.resetModules();

    /*
     * Mock PrismaClient before prisma.ts is imported.
     */
    jest.doMock('@prisma/client', () => ({
      PrismaClient: jest.fn(() => mockPrismaClient),
    }));

    /*
     * Get the mocked constructor so we can inspect
     * whether a new PrismaClient was created.
     */
    const prismaModule = require('@prisma/client');

    PrismaClientMock = prismaModule.PrismaClient;
  });

  afterEach(() => {
    jest.dontMock('@prisma/client');
    delete (globalThis as typeof globalThis & {
      prisma?: unknown;
    }).prisma;
  });

  it('creates a new PrismaClient when no global Prisma client exists', () => {
    const prismaModule = require('@/utils/db');

    expect(PrismaClientMock).toHaveBeenCalledTimes(1);
    expect(prismaModule.default).toBe(mockPrismaClient);
  });

  it('stores the Prisma client on globalThis in non-production environments', () => {
    const prismaModule = require('@/utils/db');

    const globalPrisma = (
      globalThis as typeof globalThis & {
        prisma?: unknown;
      }
    ).prisma;

    expect(globalPrisma).toBe(mockPrismaClient);
    expect(prismaModule.default).toBe(mockPrismaClient);
  });

  it('reuses the existing global Prisma client', () => {
    const existingPrismaClient = {
      existing: true,
    };

    (
      globalThis as typeof globalThis & {
        prisma?: unknown;
      }
    ).prisma = existingPrismaClient;

    const prismaModule = require('@/utils/db');

    expect(PrismaClientMock).not.toHaveBeenCalled();

    expect(prismaModule.default).toBe(existingPrismaClient);
  });
});