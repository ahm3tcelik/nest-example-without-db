import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '../src/modules/core/filters/http-exception.filter';
import { RegisterDTO, RegisterResponseDTO } from '../src/modules/auth/dto/register.dto';
import { CreateProductDTO } from '../src/modules/products/dto/create-product.dto';
import { AppModule } from '../src/app/app.module';
import { Product } from '../src/modules/products/models/product.model';
import { UpdateProductDTO } from '../src/modules/products/dto/update-product.dto';

describe('Products  with Auth (e2e)', () => {
    let app: INestApplication;
    const path = '/products';
    const product: CreateProductDTO = {
        title: 'ex title',
        description: 'ex desc',
        price: 10.5
    };
    const registerDTO: RegisterDTO = {
        email: 'ex@gmail.com',
        name: 'example name',
        surname: 'exsur',
        password: 'qqP256212.x'
    };
    let header = {
        "Authorization": 'Bearer ...'
    };

    beforeAll(async () => {

        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        app.useGlobalFilters(new HttpExceptionFilter());

        await app.init();
    })

    it('/POST register user', () => {

        return request(app.getHttpServer())
            .post('/auth/register')
            .send(registerDTO)
            .expect(HttpStatus.CREATED)
            .expect((res) => {
                const body: RegisterResponseDTO = res.body;
                header['Authorization'] = `Bearer ${body.payload.accessToken}`;
                expect(body.payload.accessToken).toBeDefined();
            });
    });

    it('/POST create product', () => {
        return request(app.getHttpServer())
            .post(path)
            .set(header)
            .send(product)
            .expect(HttpStatus.CREATED)
            .expect((res) => {
                const product: Product = res.body;
                expect(product).toBeDefined();
            });
    });

    it('/POST missing parameter to creating product. should be fail', () => {
        return request(app.getHttpServer())
            .post(path)
            .set(header)
            .send({ title: '--' })
            .expect(HttpStatus.BAD_REQUEST)
    });

    it(`/GET all products`, () => {
        return request(app.getHttpServer())
            .get(path)
            .set(header)
            .expect(HttpStatus.OK)
            .expect((res) => {
                expect(res.body[0]).toBeDefined();
            })
    });
    
    it('/GET single product', () => {
        return request(app.getHttpServer())
            .get(`${path}/1`)
            .set(header)
            .expect(HttpStatus.OK)
            .expect((res) => {
                const body: Product = res.body;
                console.log(body);
                expect(body.id).toEqual(1)
            })
    });

    it('/GET not available product', () => {
        return request(app.getHttpServer())
            .get(`${path}/99999`)
            .set(header)
            .expect(HttpStatus.NOT_FOUND)
    })
    
    it('/PATCH update products', () => {
        const dto: UpdateProductDTO = {
            title: 'NEW TITLE'
        }
        return request(app.getHttpServer())
            .patch(`${path}/1`)
            .set(header)
            .send(dto)
            .expect((res) => {
                expect(res.body.title).toEqual(dto.title)
            })
            .expect(HttpStatus.OK)
    });
    
    
    it('should not be delete product as user.', () => {
        return request(app.getHttpServer())
            .delete(`${path}/1`)
            .set(header)
            .expect(HttpStatus.FORBIDDEN)
    });

    afterAll(async () => {
        await app.close();
    });

});