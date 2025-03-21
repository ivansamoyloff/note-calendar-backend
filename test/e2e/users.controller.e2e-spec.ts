import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

describe('UsersController (e2e)', () => {
  jest.setTimeout(20000);

  let app: INestApplication;
  let prisma: PrismaService;
  let access_token: string;
  let testUserId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get(PrismaService);
    if (!prisma) throw new Error('PrismaService not initialized');

    await prisma.user.deleteMany();

    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
      data: { email: 'test_user@example.com', password: hashedPassword },
    });

    await prisma.$executeRaw`COMMIT;`;

    testUserId = user.id;

    const loginResponse: { body: { access_token: string } } = await request(
      app.getHttpServer(),
    )
      .post('/auth/login')
      .send({ email: 'test_user@example.com', password: 'password123' });

    access_token = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('/users (GET)', () => {
    it('should return a list of users with valid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${access_token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
    });

    it('should return 401 without a token', async () => {
      const response = await request(app.getHttpServer()).get('/users');

      expect(response.status).toBe(401);
    });
  });

  describe('/users/:id (GET)', () => {
    it('should return a user by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${testUserId}`)
        .set('Authorization', `Bearer ${access_token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('email', 'test_user@example.com');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/999999')
        .set('Authorization', `Bearer ${access_token}`);

      expect(response.status).toBe(404);
    });
  });

  describe('/users/email/:email (GET)', () => {
    it('should return a user by email', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/email/test_user@example.com')
        .set('Authorization', `Bearer ${access_token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('email', 'test_user@example.com');
    });

    it('should return 404 for non-existent email', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/email/unknown@example.com')
        .set('Authorization', `Bearer ${access_token}`);

      expect(response.status).toBe(404);
    });
  });

  describe('/users/create (POST)', () => {
    it('should create a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/users/create')
        .send({
          email: 'newuser@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('email', 'newuser@example.com');
    });

    it('should not create a user with an existing email', async () => {
      const response = await request(app.getHttpServer())
        .post('/users/create')
        .send({
          email: 'test_user@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(409);
    });
  });
});
