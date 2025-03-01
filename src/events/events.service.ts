import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async createEvent(data: Prisma.EventCreateInput) {
    return this.prisma.event.create({
      data,
    });
  }

  async getAllEvents() {
    return this.prisma.event.findMany();
  }

  async getEventById(id: number) {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });
    if (!event) {
      throw new Error('Event not found');
    }
    return event;
  }

  async updateEvent(id: number, updateData: Prisma.EventUpdateInput) {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });
    if (!event) {
      throw new Error('Event not found');
    }
    return this.prisma.event.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteEvent(id: number) {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });
    if (!event) {
      throw new Error('Event not found');
    }
    return this.prisma.event.delete({
      where: { id },
    });
  }
}
