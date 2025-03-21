import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  private async findTaskOrThrow(id: number, userId: number) {
    const task = await this.prisma.task.findUnique({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundException('Task not found or not accessible');
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
      throw new NotFoundException('Tasks not found or not accessible');
    }

    return tasks;
  }

  async getTaskById(id: number, userId: number) {
    return await this.findTaskOrThrow(id, userId);
  }

  async getTasksByUserId(userId: number) {
    const tasks = await this.prisma.task.findMany({
      where: {
        userId: userId,
      },
    });

    if (!tasks.length) {
      throw new NotFoundException('Tasks not found or not accessible');
    }

    return tasks;
  }

  async updateTask(
    id: number,
    userId: number,
    updateData: Prisma.TaskUpdateInput,
  ) {
    await this.findTaskOrThrow(id, userId);

    return this.prisma.task.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteTask(id: number, userId: number) {
    await this.findTaskOrThrow(id, userId);

    return this.prisma.task.delete({
      where: { id },
    });
  }
}
