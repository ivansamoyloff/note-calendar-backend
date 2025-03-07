import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

describe('Auth Module', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should include Auth Service', () => {
    const service = module.get<AuthService>(AuthService);

    expect(service).toBeDefined();
  });

  it(' should include AuthController', () => {
    const controller = module.get<AuthController>(AuthController);

    expect(controller).toBeDefined();
  });
});
