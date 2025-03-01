import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async createTask(data: Prisma.TaskCreateInput) {
    return this.prisma.task.create({
      data,
    });
  }

  async getAllTasks() {
    return this.prisma.task.findMany();
  }

  async getTaskById(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    return task;
  }

  async updateTask(id: number, updateData: Prisma.TaskUpdateInput) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    return this.prisma.task.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteTask(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    return this.prisma.task.delete({
      where: { id },
    });
  }
}
