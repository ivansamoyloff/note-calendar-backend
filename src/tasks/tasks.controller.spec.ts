import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { AuthGuard } from '@nestjs/passport';
import { Prisma } from '@prisma/client';

// Мок сервиса
const mockTasksService = {
  createTask: jest.fn((taskData) => ({ id: 1, ...taskData })),
  updateTask: jest.fn((id, updateData) => ({ id, ...updateData })),
  deleteTask: jest.fn((id) => ({ id })),
};

describe('TasksController', () => {
  let tasksController: TasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{ provide: TasksService, useValue: mockTasksService }],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: () => true }) // Мокируем AuthGuard
      .compile();

    tasksController = module.get<TasksController>(TasksController);
  });

  it('should create a task', async () => {
    const taskData: Prisma.TaskCreateInput = {
      title: 'Test Task',
      description: 'Task Description',
      startDate: new Date(),
      endDate: new Date(),
      user: { connect: { id: 1 } }, // Связь с пользователем (если есть)
    };

    const result = await tasksController.createTask(taskData);
    expect(result).toEqual({ id: 1, ...taskData });
  });

  it('should update a task', async () => {
    const updateData: Prisma.TaskUpdateInput = { title: 'Updated Task' };
    const result = await tasksController.updateTask(1, updateData);
    expect(result).toEqual({ id: 1, ...updateData });
  });

  it('should delete a task', async () => {
    const result = await tasksController.deleteTask(1);
    expect(result).toEqual({ id: 1 });
  });
});
