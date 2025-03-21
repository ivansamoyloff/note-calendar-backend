import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  private async findEventOrThrow(id: number, userId: number) {
    const event = await this.prisma.event.findUnique({
      where: { id, userId },
    });

    if (!event) {
      throw new NotFoundException('Event not found or not accessible');
    }

    return event;
  }

  async createEvent(data: Prisma.EventCreateInput) {
    return this.prisma.event.create({
      data,
    });
  }

  async getAllEvents() {
    const events = await this.prisma.event.findMany();

    if (!events.length) {
      throw new NotFoundException('Events not found or not accessible');
    }

    return events;
  }

  async getEventById(id: number, userId: number) {
    return await this.findEventOrThrow(id, userId);
  }

  async getEventsByUserId(userId: number) {
    const events = await this.prisma.event.findMany({
      where: {
        userId: userId,
      },
    });

    if (!events.length) {
      throw new NotFoundException('Events not found or not accessible');
    }

    return events;
  }

  async updateEvent(
    id: number,
    userId: number,
    updateData: Prisma.EventUpdateInput,
  ) {
    await this.findEventOrThrow(id, userId);

    return this.prisma.event.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteEvent(id: number, userId: number) {
    await this.findEventOrThrow(id, userId);

    return this.prisma.event.delete({
      where: { id },
    });
  }
}
