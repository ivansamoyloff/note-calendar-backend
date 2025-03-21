import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput) {
    const email = data.email.trim().toLowerCase();

    const existingUser = await this.getUserByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const user = await this.prisma.user.create({
      data: { email, password: data.password },
    });

    await this.prisma.$executeRaw`COMMIT;`;

    return user;
  }

  async getAllUsers() {
    return this.prisma.user.findMany();
  }

  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
    });

    return user;
  }
}
