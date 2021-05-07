import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app/app.module';
import { RegisterDTO, RegisterResponseDTO } from '../src/modules/auth/dto/register.dto';
import { HttpExceptionFilter } from '../src/modules/core/filters/http-exception.filter';
import { LoginDTO, LoginResponseDTO } from '../src/modules/auth/dto/login.dto';
import { RefreshTokenDTO } from '../src/modules/auth/dto/refresh-token.dto.';

describe('Auth Controller (e2e)', () => {
    let app: INestApplication;
    let accessToken = '', refreshToken = '';

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        app.useGlobalFilters(new HttpExceptionFilter());
        await app.init();
    });

    it('should be register', () => {
        const reqBody: RegisterDTO = {
            email: 'ex@gmail.com',
            name: 'ExName',
            surname: 'ExSurname',
            password: 'exSecret321'
        };
        return request(app.getHttpServer())
            .post('/auth/register')
            .send(reqBody)
            .expect(HttpStatus.CREATED)
            .expect((res) => {
                const body: RegisterResponseDTO = res.body;
                accessToken = body.payload.accessToken;
                refreshToken = body.payload.refreshToken;
                expect(body.payload.accessToken).toBeDefined();
            })
    });

    it('missing body to register.', () => {
        return request(app.getHttpServer())
            .post('/auth/register')
            .send({ email: 'ex@email.com' })
            .expect(HttpStatus.BAD_REQUEST)
    });

    it('should be login', () => {
        const reqBody: LoginDTO = {
            email: 'ex@gmail.com',
            password: 'exSecret321'
        }
        return request(app.getHttpServer())
            .post('/auth/login')
            .send(reqBody)
            .expect(HttpStatus.CREATED)
            .expect((res) => {
                const body: LoginResponseDTO = res.body;
                accessToken = body.payload.accessToken;
                refreshToken = body.payload.refreshToken;
                expect(body.payload.accessToken).toBeDefined();
            })
    })

    it('login fail: wrong pw', () => {
        const reqBody: LoginDTO = {
            email: 'ex@gmail.com',
            password: "wrong213"
        }
        return request(app.getHttpServer())
            .post('/auth/login')
            .send(reqBody)
            .expect(HttpStatus.UNAUTHORIZED)
    })

    describe('get new access token from refresh token', () => {
        it('should be get refresh token', () => {
            const reqBody: RefreshTokenDTO = { refreshToken: refreshToken };
            return request(app.getHttpServer())
                .post('/auth/refresh-token')
                .send(reqBody)
                .expect(HttpStatus.CREATED)
                .expect((res) => {
                    accessToken = res.body.accessToken;
                    expect(res.body.accessToken).toBeDefined();
                });
        });

        it('use successfully new access token', () => {
            return request(app.getHttpServer())
                .get('/secret')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(HttpStatus.OK);
        });

    });

    it('should be refresh token expired', () => {
        const _refreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MTk5ODk0NzYsImV4cCI6MTYxOTk4OTQ4Miwic3ViIjoiMSIsImp0aSI6IjEifQ._cma9RQOIhx-O2neV64P87KcoL_k1GPyJVUKC_A7MFI'
        return request(app.getHttpServer())
            .post('/auth/refresh-token')
            .send({ refreshToken: _refreshToken })
            .expect(HttpStatus.BAD_REQUEST);
    });

    it('should be logout', () => {
        return request(app.getHttpServer())
            .post('/auth/logout')
            .send({ refreshToken })
            .expect(HttpStatus.CREATED)
    });

    afterAll(async () => {
        await app.close();
    });
});
