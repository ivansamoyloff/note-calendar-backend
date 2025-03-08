import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { EventsModule } from './events/events.module';
import { AppController } from './app.controller';
import { JwtStrategy } from './auth/jwt.strategy';

describe('AppModule', () => {
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(moduleRef).toBeDefined();
  });

  it('should include AuthModule', () => {
    expect(moduleRef.get(AuthModule)).toBeDefined();
  });

  it('should include PrismaModule', () => {
    expect(moduleRef.get(PrismaModule)).toBeDefined();
  });

  it('should include UsersModule', () => {
    expect(moduleRef.get(UsersModule)).toBeDefined();
  });

  it('should include TasksModule', () => {
    expect(moduleRef.get(TasksModule)).toBeDefined();
  });

  it('should include EventsModule', () => {
    expect(moduleRef.get(EventsModule)).toBeDefined();
  });

  it('should include AppController', () => {
    expect(moduleRef.get(AppController)).toBeDefined();
  });

  it('should include JwtStrategy', () => {
    expect(moduleRef.get(JwtStrategy)).toBeDefined();
  });
});
