import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createTask(@Body() taskData: Prisma.TaskCreateInput) {
    return this.taskService.createTask(taskData);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAllTasks() {
    return this.taskService.getAllTasks();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getTaskById(@Param('id') id: string, @Req() req: Request) {
    const user = req['user'] as { id: number };
    return this.taskService.getTaskById(Number(id), user.id);
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard('jwt'))
  async getTasksByUserId(@Param('userId') userId: string) {
    return this.taskService.getTasksByUserId(Number(userId));
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateTask(
    @Param('id') id: string,
    @Body() updateData: Prisma.TaskUpdateInput,
    @Req() req: Request,
  ) {
    const user = req['user'] as { id: number };
    return this.taskService.updateTask(Number(id), user.id, updateData);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteTask(@Param('id') id: string, @Req() req: Request) {
    const user = req['user'] as { id: number };
    return this.taskService.deleteTask(Number(id), user.id);
  }
}
