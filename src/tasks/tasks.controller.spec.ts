import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { AuthGuard } from '@nestjs/passport';
import { Prisma } from '@prisma/client';

const mockedDate: Date = new Date();

const mockTasksService = {
  createTask: jest.fn((taskData: Prisma.TaskCreateInput) => ({
    ...taskData,
    id: 1,
    description: taskData.description ?? null,
    status: 'onHold',
    startDate: new Date(taskData.startDate),
    endDate: new Date(taskData.endDate),
    createdAt: mockedDate,
    updatedAt: mockedDate,
  })),
  updateTask: jest.fn((id: number, updateData: Prisma.TaskUpdateInput) => ({
    ...updateData,
    id,
  })),
  deleteTask: jest.fn((id: number): { id: number } => ({ id })),
  getAllTasks: jest.fn(),
  getTaskById: jest.fn(),
  getTasksByUserId: jest.fn(),
};

describe('Tasks Controller', () => {
  let tasksController: TasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{ provide: TasksService, useValue: mockTasksService }],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: () => true })
      .compile();

    tasksController = module.get<TasksController>(TasksController);
  });

  it('Tasks controller should be defined', () => {
    expect(tasksController).toBeDefined();
  });

  describe('getAllTasks', () => {
    it('should return an array of tasks', async () => {
      const result = [
        { id: 1, title: 'Test Task 1' },
        { id: 2, title: 'Test Task 2' },
      ];
      mockTasksService.getAllTasks.mockResolvedValue(result);

      expect(await tasksController.getAllTasks()).toEqual(result);
    });

    it('should throw an error if tasks are not found', async () => {
      mockTasksService.getAllTasks.mockRejectedValue(
        new Error('Tasks not found'),
      );

      await expect(tasksController.getAllTasks()).rejects.toThrow(
        'Tasks not found',
      );
    });
  });

  describe('getTaskById', () => {
    it('should return a task by ID', async () => {
      const task = { id: 1, title: 'Test Task' };
      mockTasksService.getTaskById.mockResolvedValue(task);

      expect(await tasksController.getTaskById(1)).toEqual(task);
    });

    it('should throw an error if task is not found', async () => {
      mockTasksService.getTaskById.mockRejectedValue(
        new Error('Task not found'),
      );

      await expect(tasksController.getTaskById(999)).rejects.toThrow(
        'Task not found',
      );
    });
  });

  describe('getTasksByUserId', () => {
    it('should return an array of tasks for a user', async () => {
      const result = [
        { id: 1, title: 'Task 1' },
        { id: 2, title: 'Task 2' },
      ];
      mockTasksService.getTasksByUserId.mockResolvedValue(result);

      expect(await tasksController.getTasksByUserId(1)).toEqual(result);
    });

    it('should throw an error if no tasks are found for the user', async () => {
      mockTasksService.getTasksByUserId.mockRejectedValue(
        new Error('Tasks not found'),
      );

      await expect(tasksController.getTasksByUserId(1)).rejects.toThrow(
        'Tasks not found',
      );
    });
  });

  it('Tasks controller should create a task', async () => {
    const taskData: Prisma.TaskCreateInput = {
      title: 'Test Task',
      description: 'Task Description',
      status: 'onHold',
      startDate: new Date(),
      endDate: new Date(),
      createdAt: mockedDate,
      updatedAt: mockedDate,
      user: { connect: { id: 1 } },
    };

    const result = await tasksController.createTask(taskData);
    expect(result).toEqual({ id: 1, ...taskData });
  });

  it('Tasks controller should update a task', async () => {
    const updateData: Prisma.TaskUpdateInput = { title: 'Updated Task' };
    const result = await tasksController.updateTask(1, updateData);
    expect(result).toEqual({ id: 1, ...updateData });
  });

  it('Tasks controller should delete a task', async () => {
    const result = await tasksController.deleteTask(1);
    expect(result).toEqual({ id: 1 });
  });
});
