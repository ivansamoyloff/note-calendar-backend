import { Test, TestingModule } from '@nestjs/testing';
import { TasksModule } from '../../../src/tasks/tasks.module';
import { TasksService } from '../../../src/tasks/tasks.service';
import { TasksController } from '../../../src/tasks/tasks.controller';

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

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should include Tasks Service', () => {
    const service = module.get<TasksService>(TasksService);

    expect(service).toBeDefined();
  });

  it('should include Tasks Controller', () => {
    const controller = module.get<TasksController>(TasksController);

    expect(controller).toBeDefined();
  });
});
