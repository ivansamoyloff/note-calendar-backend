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
import { EventsService } from './events.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('')
  @UseGuards(AuthGuard('jwt'))
  async getAllEvents() {
    return this.eventsService.getAllEvents();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getEventById(@Param('id') id: number) {
    return this.eventsService.getEventById(id);
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard('jwt'))
  async getEventsByUserId(@Param('id') id: number) {
    return this.eventsService.getEventsByUserId(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createEvent(@Body() eventData: Prisma.EventCreateInput) {
    return this.eventsService.createEvent(eventData);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateEvent(
    @Param('id') id: number,
    @Body() updateData: Prisma.EventUpdateInput,
  ) {
    return this.eventsService.updateEvent(id, updateData);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteEvent(@Param('id') id: number) {
    return this.eventsService.deleteEvent(id);
  }
}
