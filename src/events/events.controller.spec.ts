import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { AuthGuard } from '@nestjs/passport';
import { Prisma } from '@prisma/client';

const mockedDate: Date = new Date();

const mockEventsService = {
  createEvent: jest.fn((eventData: Prisma.EventCreateInput) => ({
    ...eventData,
    id: 1,
    description: eventData.description ?? null,
    meetLink: 'Test link',
    location: 'Test location',
    startDate: new Date(eventData.startDate),
    endDate: new Date(eventData.endDate),
    createdAt: mockedDate,
    updatedAt: mockedDate,
  })),
  updateEvent: jest.fn((id: number, updateData: Prisma.EventUpdateInput) => ({
    ...updateData,
    id,
  })),
  deleteEvent: jest.fn((id: number): { id: number } => ({ id })),
  getAllEvents: jest.fn(),
  getEventById: jest.fn(),
  getEventsByUserId: jest.fn(),
};

describe('Events Controller', () => {
  let eventsController: EventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [{ provide: EventsService, useValue: mockEventsService }],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: () => true })
      .compile();

    eventsController = module.get<EventsController>(EventsController);
  });

  it('Events controller should be defined', () => {
    expect(eventsController).toBeDefined();
  });

  describe('getAllEvents', () => {
    it('should return an array of events', async () => {
      const result = [
        { id: 1, title: 'Test Event 1' },
        { id: 2, title: 'Test Event 2' },
      ];
      mockEventsService.getAllEvents.mockResolvedValue(result);

      expect(await eventsController.getAllEvents()).toEqual(result);
    });

    it('should throw an error if events are not found', async () => {
      mockEventsService.getAllEvents.mockRejectedValue(
        new Error('Events not found'),
      );

      await expect(eventsController.getAllEvents()).rejects.toThrow(
        'Events not found',
      );
    });
  });

  describe('getEventById', () => {
    it('should return a event by ID', async () => {
      const event = { id: 1, title: 'Test Event' };
      mockEventsService.getEventById.mockResolvedValue(event);

      expect(await eventsController.getEventById(1)).toEqual(event);
    });

    it('should throw an error if event is not found', async () => {
      mockEventsService.getEventById.mockRejectedValue(
        new Error('Event not found'),
      );

      await expect(eventsController.getEventById(999)).rejects.toThrow(
        'Event not found',
      );
    });
  });

  describe('getEventsByUserId', () => {
    it('should return an array of events for a user', async () => {
      const result = [
        { id: 1, title: 'Event 1' },
        { id: 2, title: 'Event 2' },
      ];
      mockEventsService.getEventsByUserId.mockResolvedValue(result);

      expect(await eventsController.getEventsByUserId(1)).toEqual(result);
    });

    it('should throw an error if no events are found for the user', async () => {
      mockEventsService.getEventsByUserId.mockRejectedValue(
        new Error('Events not found'),
      );

      await expect(eventsController.getEventsByUserId(1)).rejects.toThrow(
        'Events not found',
      );
    });
  });

  it('Events controller should create a event', async () => {
    const eventData: Prisma.EventCreateInput = {
      title: 'Test Event',
      description: 'Event Description',
      meetLink: 'Test link',
      location: 'Test location',
      startDate: new Date(),
      endDate: new Date(),
      createdAt: mockedDate,
      updatedAt: mockedDate,
      user: { connect: { id: 1 } },
    };

    const result = await eventsController.createEvent(eventData);
    expect(result).toEqual({ id: 1, ...eventData });
  });

  it('Events controller should update a event', async () => {
    const updateData: Prisma.EventUpdateInput = { title: 'Updated Event' };
    const result = await eventsController.updateEvent(1, updateData);
    expect(result).toEqual({ id: 1, ...updateData });
  });

  it('Events controller should delete a event', async () => {
    const result = await eventsController.deleteEvent(1);
    expect(result).toEqual({ id: 1 });
  });
});
