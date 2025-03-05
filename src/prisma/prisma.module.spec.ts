import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from './prisma.module';

describe('Prisma Module', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [PrismaModule],
    }).compile();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Prisma module should be should be defined', () => {
    expect(module).toBeDefined();
  });
});
