import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  private async findTaskOrThrow(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    return task;
  }

  async createTask(data: Prisma.TaskCreateInput) {
    return this.prisma.task.create({
      data,
    });
  }

  async getAllTasks() {
    const tasks = await this.prisma.task.findMany();

    if (!tasks.length) {
      throw new Error('Tasks not found');
    }

    return tasks;
  }

  async getTaskById(id: number) {
    return await this.findTaskOrThrow(id);
  }

  async getTasksByUserId(userId: number) {
    const tasks = await this.prisma.task.findMany({
      where: {
        userId: userId,
      },
    });

    if (!tasks.length) {
      throw new Error('Tasks not found');
    }

    return tasks;
  }

  async updateTask(id: number, updateData: Prisma.TaskUpdateInput) {
    await this.findTaskOrThrow(id);

    return this.prisma.task.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteTask(id: number) {
    await this.findTaskOrThrow(id);

    return this.prisma.task.delete({
      where: { id },
    });
  }
}
