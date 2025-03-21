import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import ITask from '../../interfaces/task.interface';
import * as bcrypt from 'bcryptjs';

describe('TasksController (e2e)', () => {
  jest.setTimeout(20000);

  let app: INestApplication;
  let prisma: PrismaService;
  let access_token: string;
  let testUserId: number;
  let testTaskId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get(PrismaService);

    await prisma.task.deleteMany();

    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
      data: { email: 'test_task@example.com', password: hashedPassword },
    });
    testUserId = user.id;

    const loginResponse: { body: { access_token: string } } = await request(
      app.getHttpServer(),
    )
      .post('/auth/login')
      .send({ email: 'test_task@example.com', password: 'password123' });
    access_token = loginResponse.body.access_token;

    const task = await prisma.task.create({
      data: {
        title: 'Initial Task',
        userId: testUserId,
        startDate: new Date(Date.now()),
        endDate: new Date(Date.now() + 3600 * 1000),
      },
    });
    testTaskId = task.id;
  });

  afterAll(async () => {
    await prisma.task.deleteMany();
    await app.close();
  });

  it('/tasks (POST) - should create a task', async () => {
    const response = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        title: 'New Task',
        userId: testUserId,
        startDate: new Date(Date.now()),
        endDate: new Date(Date.now() + 3600 * 1000),
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect((response.body as ITask).title).toEqual('New Task');
  });

  it('/tasks (GET) - should return all tasks', async () => {
    const response = await request(app.getHttpServer())
      .get('/tasks')
      .set('Authorization', `Bearer ${access_token}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/tasks/:id (GET) - should return a task by ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/tasks/${testTaskId}`)
      .set('Authorization', `Bearer ${access_token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', testTaskId);
    expect((response.body as ITask).title).toEqual('Initial Task');
  });

  it('/tasks/user/:userId (GET) - should return tasks by user ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/tasks/user/${testUserId}`)
      .set('Authorization', `Bearer ${access_token}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    (response.body as ITask[]).forEach((task) => {
      expect(task.userId).toEqual(testUserId);
    });
  });

  it('/tasks/:id (PUT) - should update a task', async () => {
    const response = await request(app.getHttpServer())
      .put(`/tasks/${testTaskId}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send({ title: 'Updated Task' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('title', 'Updated Task');
  });

  it('/tasks/:id (DELETE) - should delete a task', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/tasks/${testTaskId}`)
      .set('Authorization', `Bearer ${access_token}`);
    expect(response.status).toBe(200);

    const getResponse = await request(app.getHttpServer())
      .get(`/tasks/${testTaskId}`)
      .set('Authorization', `Bearer ${access_token}`);
    expect(getResponse.status).toBe(404);
  });

  it('/tasks/:id (GET) - should return 404 for non-existent task', async () => {
    const response = await request(app.getHttpServer())
      .get('/tasks/99999')
      .set('Authorization', `Bearer ${access_token}`);
    expect(response.status).toBe(404);
  });
});
