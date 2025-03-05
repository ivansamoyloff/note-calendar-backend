import { Test, TestingModule } from '@nestjs/testing';
import { TasksModule } from './tasks.module';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';

describe('Tasks Module', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [TasksModule],
    }).compile();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Tasks module should be should be defined', () => {
    expect(module).toBeDefined();
  });

  it('Tasks module should include Tasks Service', () => {
    const service = module.get<TasksService>(TasksService);

    expect(service).toBeDefined();
  });

  it('Tasks module should include Tasks Controller', () => {
    const controller = module.get<TasksController>(TasksController);

    expect(controller).toBeDefined();
  });
});
