import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { AuthGuard } from '@nestjs/passport';
import { Prisma } from '@prisma/client';
import { Request } from 'express';

@Controller('events')
@UseGuards(AuthGuard('jwt'))
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async createEvent(@Body() data: Prisma.EventCreateInput) {
    return this.eventsService.createEvent({
      ...data,
    });
  }

  @Get()
  async getAllEvents() {
    return this.eventsService.getAllEvents();
  }

  @Get(':id')
  async getEventById(@Param('id') id: string, @Req() req: Request) {
    const user = req['user'] as { id: number };
    return this.eventsService.getEventById(Number(id), user.id);
  }

  @Get('user/:userId')
  async getEventsByUserId(@Param('userId') userId: string) {
    return this.eventsService.getEventsByUserId(Number(userId));
  }

  @Put(':id')
  async updateEvent(
    @Param('id') id: string,
    @Body() updateData: Prisma.EventUpdateInput,
    @Req() req: Request,
  ) {
    const user = req['user'] as { id: number };
    return this.eventsService.updateEvent(Number(id), user.id, updateData);
  }

  @Delete(':id')
  async deleteEvent(@Param('id') id: string, @Req() req: Request) {
    const user = req['user'] as { id: number };
    return this.eventsService.deleteEvent(Number(id), user.id);
  }
}
