import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get('')
  @UseGuards(AuthGuard('jwt'))
  async getAllTasks() {
    return this.taskService.getAllTasks();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getTaskById(@Param('id') id: number) {
    return this.taskService.getTaskById(id);
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard('jwt'))
  async getTasksByUserId(@Param('id') id: number) {
    return this.taskService.getTasksByUserId(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createTask(@Body() taskData: Prisma.TaskCreateInput) {
    return this.taskService.createTask(taskData);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateTask(
    @Param('id') id: number,
    @Body() updateData: Prisma.TaskUpdateInput,
  ) {
    return this.taskService.updateTask(id, updateData);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteTask(@Param('id') id: number) {
    return this.taskService.deleteTask(id);
  }
}
