import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [AuthService, UsersService, JwtService, PrismaService],
  controllers: [AuthController],
})
export class AuthModule {}
