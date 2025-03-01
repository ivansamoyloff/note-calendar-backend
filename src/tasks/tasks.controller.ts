import {
  Body,
  Controller,
  Delete,
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

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createTask(@Body() taskData: Prisma.TaskCreateInput) {
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
