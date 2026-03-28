import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import * as fs from 'fs';
import * as path from 'path';

describe('Tasks (e2e)', () => {
  let app: INestApplication;
  const testDbPath = path.join(__dirname, 'test-e2e.sqlite');
  const testIndexPath = path.join(__dirname, 'test-e2e.idx');

  beforeEach(async () => {
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
    if (fs.existsSync(testIndexPath)) {
      fs.unlinkSync(testIndexPath);
    }

    process.env.SQLITE_DB_PATH = testDbPath;
    process.env.INDEX_FILE_PATH = testIndexPath;
    process.env.STORAGE_TYPE = 'sqlite';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
    if (fs.existsSync(testIndexPath)) {
      fs.unlinkSync(testIndexPath);
    }
  });

  afterAll(() => {
    delete process.env.SQLITE_DB_PATH;
    delete process.env.INDEX_FILE_PATH;
    delete process.env.STORAGE_TYPE;
  });

  it('/tasks (POST)', () => {
    return request(app.getHttpServer())
      .post('/tasks')
      .send({ description: 'Test task' })
      .expect(201);
  });

  it('/tasks (GET)', () => {
    return request(app.getHttpServer())
      .get('/tasks')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it('/tasks/:id (GET)', async () => {
    await request(app.getHttpServer())
      .post('/tasks')
      .send({ description: 'Test task' })
      .expect(201);

    return request(app.getHttpServer())
      .get('/tasks/1')
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(1);
        expect(res.body.description).toBe('Test task');
      });
  });

  it('/tasks/:id (GET) - not found', () => {
    return request(app.getHttpServer()).get('/tasks/999').expect(404);
  });

  it('/tasks (PATCH)', async () => {
    await request(app.getHttpServer())
      .post('/tasks')
      .send({ description: 'Original task' })
      .expect(201);

    return request(app.getHttpServer())
      .patch('/tasks')
      .send({ id: 1, description: 'Updated task' })
      .expect(200);
  });

  it('/tasks (PATCH) - not found', () => {
    return request(app.getHttpServer())
      .patch('/tasks')
      .send({ id: 999, description: 'Updated task' })
      .expect(404);
  });

  it('/tasks/:id (DELETE)', async () => {
    await request(app.getHttpServer())
      .post('/tasks')
      .send({ description: 'Task to delete' })
      .expect(201);

    return request(app.getHttpServer()).delete('/tasks/1').expect(200);
  });

  it('/tasks/:id (DELETE) - not found', () => {
    return request(app.getHttpServer()).delete('/tasks/999').expect(404);
  });

  it('full CRUD workflow', async () => {
    const agent = request.agent(app.getHttpServer());

    await agent.post('/tasks').send({ description: 'Task 1' }).expect(201);
    await agent.post('/tasks').send({ description: 'Task 2' }).expect(201);
    await agent.post('/tasks').send({ description: 'Task 3' }).expect(201);

    await agent
      .get('/tasks')
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBe(3);
      });

    await agent
      .get('/tasks/1')
      .expect(200)
      .expect((res) => {
        expect(res.body.description).toBe('Task 1');
      });

    await agent
      .patch('/tasks')
      .send({ id: 1, description: 'Updated Task 1' })
      .expect(200);

    await agent
      .get('/tasks/1')
      .expect(200)
      .expect((res) => {
        expect(res.body.description).toBe('Updated Task 1');
      });

    await agent.delete('/tasks/2').expect(200);

    await agent
      .get('/tasks')
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBe(2);
      });
  });

  it('should validate request body', () => {
    return request(app.getHttpServer())
      .post('/tasks')
      .send({ description: '' })
      .expect(400);
  });

  it('should reject extra fields', () => {
    return request(app.getHttpServer())
      .post('/tasks')
      .send({ description: 'Task', extraField: 'should be rejected' })
      .expect(400);
  });
});
