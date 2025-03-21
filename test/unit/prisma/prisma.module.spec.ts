import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../../../src/prisma/prisma.module';

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

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});
