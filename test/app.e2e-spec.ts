import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('App (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let normalToken: string;
  let limitedToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();

    const adminLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'admin',
        password: 'Admin@Secure#2024',
      })
      .expect(200);

    adminToken = adminLogin.body.access_token;

    const normalLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'normal',
        password: 'Normal$User!Pass',
      })
      .expect(200);

    normalToken = normalLogin.body.access_token;

    const limitedLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'limited',
        password: 'Limited&View@Only',
      })
      .expect(200);

    limitedToken = limitedLogin.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should login admin successfully', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'admin',
        password: 'Admin@Secure#2024',
      })
      .expect(200);

    expect(response.body.access_token).toBeDefined();
  });

  it('should return locus data for admin', async () => {
    const response = await request(app.getHttpServer())
      .get('/locus')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should forbid sideloading for normal user', async () => {
    await request(app.getHttpServer())
      .get('/locus?sideloading=locusMembers')
      .set('Authorization', `Bearer ${normalToken}`)
      .expect(403);
  });

  it('should allow sideloading for admin', async () => {
    const response = await request(app.getHttpServer())
      .get('/locus?sideloading=locusMembers&limit=1')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);

    if (response.body.length > 0) {
      expect(response.body[0]).toHaveProperty('locusMembers');
    }
  });

  it('should return array for limited user', async () => {
    const response = await request(app.getHttpServer())
      .get('/locus')
      .set('Authorization', `Bearer ${limitedToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });
});
