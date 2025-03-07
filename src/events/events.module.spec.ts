import { Test, TestingModule } from '@nestjs/testing';
import { EventsModule } from './events.module';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';

describe('Events Module', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [EventsModule],
    }).compile();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Events module should be should be defined', () => {
    expect(module).toBeDefined();
  });

  it('Events module should include Events Service', () => {
    const service = module.get<EventsService>(EventsService);

    expect(service).toBeDefined();
  });

  it('Events module should include Events Controller', () => {
    const controller = module.get<EventsController>(EventsController);

    expect(controller).toBeDefined();
  });
});
