import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';


describe('Tasks Module', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should include Tasks Service', () => {
    const service = module.get<UsersService>(UsersService);

    expect(service).toBeDefined();
  });

  it('should include Tasks Controller', () => {
    const controller = module.get<UsersController>(UsersController);

    expect(controller).toBeDefined();
  });
});
