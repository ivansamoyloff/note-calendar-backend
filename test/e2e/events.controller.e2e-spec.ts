import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import IEvent from 'interfaces/event.interface';
import * as bcrypt from 'bcryptjs';

describe('EventsController (e2e)', () => {
  jest.setTimeout(20000);

  let app: INestApplication;
  let prisma: PrismaService;
  let access_token: string;
  let testUserId: number;
  let testEventId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get(PrismaService);

    await prisma.event.deleteMany();

    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
      data: { email: 'test_event@example.com', password: hashedPassword },
    });
    testUserId = user.id;

    const loginResponse: { body: { access_token: string } } = await request(
      app.getHttpServer(),
    )
      .post('/auth/login')
      .send({ email: 'test_event@example.com', password: 'password123' });
    access_token = loginResponse.body.access_token;

    const event = await prisma.event.create({
      data: {
        title: 'Initial Event',
        userId: testUserId,
        startDate: new Date(Date.now()),
        endDate: new Date(Date.now() + 3600 * 1000),
      },
    });
    testEventId = event.id;
  });

  afterAll(async () => {
    await prisma.event.deleteMany();
    await app.close();
  });

  it('/events (POST) - should create an event', async () => {
    const response = await request(app.getHttpServer())
      .post('/events')
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        title: 'New Event',
        userId: testUserId,
        startDate: new Date(Date.now()),
        endDate: new Date(Date.now() + 3600 * 1000),
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect((response.body as IEvent).title).toEqual('New Event');
  });

  it('/events (GET) - should return all events', async () => {
    const response = await request(app.getHttpServer())
      .get('/events')
      .set('Authorization', `Bearer ${access_token}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/events/:id (GET) - should return an event by ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/events/${testEventId}`)
      .set('Authorization', `Bearer ${access_token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', testEventId);
    expect(response.body).toHaveProperty('title', 'Initial Event');
  });

  it('/events/user/:userId (GET) - should return events by user ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/events/user/${testUserId}`)
      .set('Authorization', `Bearer ${access_token}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    (response.body as IEvent[]).forEach((event) => {
      expect(event.userId).toEqual(testUserId);
    });
  });

  it('/events/:id (PUT) - should update an event', async () => {
    const response = await request(app.getHttpServer())
      .put(`/events/${testEventId}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send({ title: 'Updated Event' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('title', 'Updated Event');
  });

  it('/events/:id (DELETE) - should delete an event', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/events/${testEventId}`)
      .set('Authorization', `Bearer ${access_token}`);
    expect(response.status).toBe(200);

    const getResponse = await request(app.getHttpServer())
      .get(`/events/${testEventId}`)
      .set('Authorization', `Bearer ${access_token}`);
    expect(getResponse.status).toBe(404);
  });

  it('/events/:id (GET) - should return 404 for non-existent event', async () => {
    const response = await request(app.getHttpServer())
      .get('/events/99999')
      .set('Authorization', `Bearer ${access_token}`);
    expect(response.status).toBe(404);
  });
});
