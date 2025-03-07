import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

const eventMock: Prisma.EventCreateInput = {
  title: 'Test Event',
  description: 'This is a test event',
  meetLink: 'Test link',
  location: 'Test location',
  startDate: new Date(),
  endDate: new Date(),
  user: { connect: { id: 1 } },
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPrismaService = {
  event: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('Events Service', () => {
  let service: EventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a event record', async () => {
    const eventData: Prisma.EventCreateInput = { ...eventMock };
    const createdEvent = { id: 1, ...eventMock };

    mockPrismaService.event.create.mockResolvedValue(createdEvent);

    const result = await service.createEvent(eventData);

    expect(result).toEqual(createdEvent);
    expect(mockPrismaService.event.create).toHaveBeenCalledWith({
      data: eventData,
    });
  });

  describe('getAllEvents', () => {
    it('should return a full events list', async () => {
      const events = [
        { id: 1, ...eventMock },
        { id: 2, ...eventMock },
        { id: 3, ...eventMock },
      ];

      mockPrismaService.event.findMany.mockResolvedValue(events);

      const result = await service.getAllEvents();

      expect(result).toEqual(events);
      expect(mockPrismaService.event.findMany).toHaveBeenCalled();
    });

    it('should throw an error if no events found', async () => {
      mockPrismaService.event.findMany.mockResolvedValue([]);

      await expect(service.getAllEvents()).rejects.toThrow('Events not found');
    });
  });

  describe('getEventById', () => {
    it('should return a event by ID', async () => {
      const event = { id: 1, ...eventMock };

      mockPrismaService.event.findUnique.mockResolvedValue(event);

      const result = await service.getEventById(1);

      expect(result).toEqual(event);
      expect(mockPrismaService.event.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("should throw an error if event wasn't found", async () => {
      mockPrismaService.event.findUnique.mockResolvedValue(null);

      await expect(service.getEventById(999)).rejects.toThrow(
        'Event not found',
      );
    });
  });

  describe('getEventsByUserId', () => {
    it('should return events if events are found for the user', async () => {
      const eventsMock = [
        { id: 1, title: 'Test Event 1' },
        { id: 2, title: 'Test Event 2' },
      ];

      mockPrismaService.event.findMany.mockResolvedValue(eventsMock);

      const events = await service.getEventsByUserId(1);

      expect(events).toEqual(eventsMock);
      expect(mockPrismaService.event.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
      });
    });

    it('should throw an error if no events are found for the user', async () => {
      mockPrismaService.event.findMany.mockResolvedValue([]);

      await expect(service.getEventsByUserId(1)).rejects.toThrow(
        'Events not found',
      );
      expect(mockPrismaService.event.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
      });
    });
  });

  describe('updateEvent', () => {
    it('should update a event record', async () => {
      const updateData = { title: 'Updated Event' };
      const updatedEvent = { id: 1, ...eventMock, title: 'Updated Event' };

      mockPrismaService.event.findUnique.mockResolvedValue(updatedEvent);
      mockPrismaService.event.update.mockResolvedValue(updatedEvent);

      const result = await service.updateEvent(1, updateData);

      expect(result).toEqual(updatedEvent);

      expect(mockPrismaService.event.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(mockPrismaService.event.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData,
      });
    });

    it("should throw an error if event to update wasn't found", async () => {
      mockPrismaService.event.findUnique.mockResolvedValue(null);

      await expect(
        service.updateEvent(999, { title: 'Updated' }),
      ).rejects.toThrow('Event not found');
    });
  });

  describe('deleteEvent', () => {
    it('should delete a event record', async () => {
      const deletedEvent = { id: 1, title: 'Event to delete' };

      mockPrismaService.event.findUnique.mockResolvedValue(deletedEvent);
      mockPrismaService.event.delete.mockResolvedValue(deletedEvent);

      const result = await service.deleteEvent(1);

      expect(result).toEqual(deletedEvent);

      expect(mockPrismaService.event.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(mockPrismaService.event.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("should throw an error if event to delete wasn't found", async () => {
      mockPrismaService.event.findUnique.mockResolvedValue(null);

      await expect(service.deleteEvent(999)).rejects.toThrow('Event not found');
    });
  });
});
