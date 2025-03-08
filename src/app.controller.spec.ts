import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { PrismaService } from './prisma/prisma.service';

describe('AppController', () => {
  let appController: AppController;
  let mockPrismaService: Partial<PrismaService>;

  beforeEach(async () => {
    mockPrismaService = {
      $queryRaw: jest.fn().mockResolvedValue(1),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    appController = module.get<AppController>(AppController);
  });

  it('should return status ok when DB is connected', async () => {
    await expect(appController.healthCheck()).resolves.toEqual({
      status: 'ok',
      db: 'connected',
    });
  });

  it('should return status error when DB is disconnected', async () => {
    const errorMsg = new Error('DB down');
    mockPrismaService.$queryRaw = jest.fn().mockRejectedValue(errorMsg);

    await expect(appController.healthCheck()).resolves.toEqual({
      status: 'error',
      db: 'disconnected',
      msg: errorMsg,
    });
  });
});
