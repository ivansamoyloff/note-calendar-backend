import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

describe('AuthController (e2e)', () => {
  jest.setTimeout(20000);

  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get(PrismaService);

    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test_auth@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('access_token');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should not register with an existing email', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await prisma.user.create({
        data: { email: 'duplicate_auth@example.com', password: hashedPassword },
      });

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'duplicate_auth@example.com', password: 'password123' });

      expect(response.status).toBe(409);
    });
  });

  describe('auth/login (POST)', () => {
    beforeAll(async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await prisma.user.create({
        data: { email: 'test_login@example.com', password: hashedPassword },
      });
    });

    it('should login successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test_login@example.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('access_token');
    });

    it('should not login with wrong password', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test_login@example.com', password: 'wrongpass' });

      expect(response.status).toBe(401);
    });
  });
});
