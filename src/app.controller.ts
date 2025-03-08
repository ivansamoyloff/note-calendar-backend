import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get('health-check')
  async healthCheck() {
    try {
      await this.prismaService.$queryRaw`SELECT 1`;
      return { status: 'ok', db: 'connected' };
    } catch (error: unknown) {
      return { status: 'error', db: 'disconnected', msg: error };
    }
  }
}
