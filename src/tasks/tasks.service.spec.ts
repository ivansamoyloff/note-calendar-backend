import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

const taskMock: Prisma.TaskCreateInput = {
  title: 'Test Task',
  description: 'This is a test task',
  status: 'onHold',
  startDate: new Date(),
  endDate: new Date(),
  user: { connect: { id: 1 } },
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPrismaService = {
  task: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('Tasks Service', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Tasks service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Tasks service should create a task record', async () => {
    const taskData: Prisma.TaskCreateInput = { ...taskMock };
    const createdTask = { id: 1, ...taskMock };

    mockPrismaService.task.create.mockResolvedValue(createdTask);

    const result = await service.createTask(taskData);

    expect(result).toEqual(createdTask);
    expect(mockPrismaService.task.create).toHaveBeenCalledWith({
      data: taskData,
    });
  });

  describe('getAllTasks', () => {
    it('Tasks service should return a full tasks list', async () => {
      const tasks = [
        { id: 1, ...taskMock },
        { id: 2, ...taskMock },
        { id: 3, ...taskMock },
      ];

      mockPrismaService.task.findMany.mockResolvedValue(tasks);

      const result = await service.getAllTasks();

      expect(result).toEqual(tasks);
      expect(mockPrismaService.task.findMany).toHaveBeenCalled();
    });

    it('Tasks service should throw an error if no tasks found', async () => {
      mockPrismaService.task.findMany.mockResolvedValue([]);

      await expect(service.getAllTasks()).rejects.toThrow('Tasks not found');
    });
  });

  describe('getTaskById', () => {
    it('Tasks service should return a task by ID', async () => {
      const task = { id: 1, ...taskMock };

      mockPrismaService.task.findUnique.mockResolvedValue(task);

      const result = await service.getTaskById(1);

      expect(result).toEqual(task);
      expect(mockPrismaService.task.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("Tasks service should throw an error if task wasn't found", async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(null);

      await expect(service.getTaskById(999)).rejects.toThrow('Task not found');
    });
  });

  describe('getTasksByUserId', () => {
    it('should return tasks if tasks are found for the user', async () => {
      const tasksMock = [
        { id: 1, title: 'Test Task 1' },
        { id: 2, title: 'Test Task 2' },
      ];

      mockPrismaService.task.findMany.mockResolvedValue(tasksMock);

      const tasks = await service.getTasksByUserId(1);

      expect(tasks).toEqual(tasksMock);
      expect(mockPrismaService.task.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
      });
    });

    it('should throw an error if no tasks are found for the user', async () => {
      mockPrismaService.task.findMany.mockResolvedValue([]);

      await expect(service.getTasksByUserId(1)).rejects.toThrow(
        'Tasks not found',
      );
      expect(mockPrismaService.task.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
      });
    });
  });

  describe('updateTask', () => {
    it('Tasks service should update a task record', async () => {
      const updateData = { title: 'Updated Task' };
      const updatedTask = { id: 1, ...taskMock, title: 'Updated Task' };

      mockPrismaService.task.findUnique.mockResolvedValue(updatedTask);
      mockPrismaService.task.update.mockResolvedValue(updatedTask);

      const result = await service.updateTask(1, updateData);

      expect(result).toEqual(updatedTask);

      expect(mockPrismaService.task.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(mockPrismaService.task.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData,
      });
    });

    it("Tasks service should throw an error if task to update wasn't found", async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(null);

      await expect(
        service.updateTask(999, { title: 'Updated' }),
      ).rejects.toThrow('Task not found');
    });
  });

  describe('deleteTask', () => {
    it('Tasks service should delete a task record', async () => {
      const deletedTask = { id: 1, title: 'Task to delete' };

      mockPrismaService.task.findUnique.mockResolvedValue(deletedTask);
      mockPrismaService.task.delete.mockResolvedValue(deletedTask);

      const result = await service.deleteTask(1);

      expect(result).toEqual(deletedTask);

      expect(mockPrismaService.task.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(mockPrismaService.task.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("Tasks service should throw an error if task to delete wasn't found", async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(null);

      await expect(service.deleteTask(999)).rejects.toThrow('Task not found');
    });
  });
});
