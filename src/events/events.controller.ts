import {
  Body,
  Controller,
  Delete,
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
