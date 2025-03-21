import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { cleanupDatabase } from '../../utils/test-prisma-cleanup';

describe('PrismaService', () => {
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);

    jest.spyOn(prismaService, '$connect').mockResolvedValue(undefined);
    jest.spyOn(prismaService, '$disconnect').mockResolvedValue(undefined);
    jest
      .spyOn(prismaService, '$queryRaw')
      .mockResolvedValue([
        { tablename: 'user' },
        { tablename: 'task' },
        { tablename: 'event' },
      ]);
    jest.spyOn(prismaService, '$executeRawUnsafe').mockResolvedValue(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(prismaService).toBeDefined();
  });

  it('should use the correct database URL in test environment', () => {
    process.env.NODE_ENV = 'test';
    process.env.TEST_DATABASE_URL = 'test-db-url';

    const prisma = new PrismaService();

    expect(prisma).toBeDefined();
  });

  it('should use the correct database URL in prod environment', () => {
    process.env.NODE_ENV = 'development';
    process.env.DATABASE_URL = 'dev-db-url';

    const prisma = new PrismaService();

    expect(prisma).toBeDefined();
  });

  it('should connect to the database on module init', async () => {
    const connectSpy = jest.spyOn(prismaService, '$connect');

    await prismaService.onModuleInit();

    expect(connectSpy).toHaveBeenCalled();
  });

  it('should disconnect from the database on module destroy', async () => {
    const disconnectSpy = jest.spyOn(prismaService, '$disconnect');

    await prismaService.onModuleDestroy();

    expect(disconnectSpy).toHaveBeenCalled();
  });

  it('should clean up the database', async () => {
    const queryRawSpy = jest.spyOn(prismaService, '$queryRaw');
    const executeRawSpy = jest.spyOn(prismaService, '$executeRawUnsafe');

    await cleanupDatabase(prismaService);

    expect(queryRawSpy).toHaveBeenCalled();
    expect(executeRawSpy).toHaveBeenCalledTimes(3);
    expect(executeRawSpy).toHaveBeenCalledWith(
      `TRUNCATE TABLE "user" RESTART IDENTITY CASCADE;`,
    );
    expect(executeRawSpy).toHaveBeenCalledWith(
      `TRUNCATE TABLE "task" RESTART IDENTITY CASCADE;`,
    );
    expect(executeRawSpy).toHaveBeenCalledWith(
      `TRUNCATE TABLE "event" RESTART IDENTITY CASCADE;`,
    );
  });
});
