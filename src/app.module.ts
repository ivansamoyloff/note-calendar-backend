import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/jwt.strategy';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { EventsModule } from './events/events.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [AuthModule, PrismaModule, UsersModule, TasksModule, EventsModule],
  controllers: [AppController],
  providers: [JwtStrategy, PrismaService],
})
export class AppModule {}
