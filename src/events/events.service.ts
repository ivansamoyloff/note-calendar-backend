import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  private async findEventOrThrow(id: number) {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new Error('Event not found');
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
      throw new Error('Events not found');
    }

    return events;
  }

  async getEventById(id: number) {
    return await this.findEventOrThrow(id);
  }

  async getEventsByUserId(userId: number) {
    const events = await this.prisma.event.findMany({
      where: {
        userId: userId,
      },
    });

    if (!events.length) {
      throw new Error('Events not found');
    }

    return events;
  }

  async updateEvent(id: number, updateData: Prisma.EventUpdateInput) {
    await this.findEventOrThrow(id);

    return this.prisma.event.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteEvent(id: number) {
    await this.findEventOrThrow(id);

    return this.prisma.event.delete({
      where: { id },
    });
  }
}
