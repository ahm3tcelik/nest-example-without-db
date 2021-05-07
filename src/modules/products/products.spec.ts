import { Test } from '@nestjs/testing';
import { UpdateProductDTO } from './dto/update-product.dto';
import { Product } from './models/product.model';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
    let productsController: ProductsController;
    let productsService: ProductsService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [ProductsController],
            providers: [{
                provide: ProductsService,
                useValue: {
                    findAll: jest.fn().mockImplementation(
                        (afterId: number, limit: number) => Promise.resolve<Product[]>([
                            { id: 1, title: 'title1', description: 'desc1', price: 10.0 },
                            { id: 2, title: 'title2', description: 'desc2', price: 20.0 }
                        ])
                    ),
                    findOne: jest.fn().mockImplementation(
                        (id: number) => Promise.resolve<Product>(
                            { id: id, title: 'title1', description: 'desc1', price: 10.0 },
                        )
                    ),
                    updateOne: jest.fn().mockImplementation(
                        (id: number, DTO: UpdateProductDTO) => Promise.resolve<Product>({
                            id: id, title: DTO.title, description: DTO.description, price: DTO.price
                        }
                        )
                    ),
                    deleteOne: jest.fn().mockImplementation(
                        (id: number) => Promise.resolve<Product>({
                            id: id, title: 'title1', description: 'desc1', price: 10.0
                        })
                    )
                }
            }]
        }).compile();

        productsService = moduleRef.get<ProductsService>(ProductsService);
        productsController = moduleRef.get<ProductsController>(ProductsController);
    });

    it('should be defined', () => {
        expect(productsController).toBeDefined();
    });

    describe('getProducts', () => {
        it('should return array of product', () => {
            expect(productsController.findAll()).resolves.toEqual([
                { id: 1, title: 'title1', description: 'desc1', price: 10.0 },
                { id: 2, title: 'title2', description: 'desc2', price: 20.0 }
            ]);
        });
    });

    describe('getProductById', () => {
        it('should return product', () => {
            expect(productsController.findOne(1)).resolves.toEqual(
                { id: 1, title: 'title1', description: 'desc1', price: 10.0 }
            )
        });
    });

    describe('updateProductById', () => {
        it('should update product title to "NEW TITLE" which id equal 1', () => {
            const id = 1;
            const DTO: UpdateProductDTO = { title: 'NEW TITLE', price: 10.0, description: 'desc1' }
            expect(productsController.updateOne(id, DTO)).resolves.toEqual(
                { id: 1, title: 'NEW TITLE', description: 'desc1', price: 10.0 }
            )
        });
    });

    describe('deleteProductById', () => {
        it('delete product which id  equal 1 and return deleted item', () => {
            expect(productsController.deleteOne(1)).resolves.toEqual(
                { id: 1, title: 'title1', description: 'desc1', price: 10.0 }
            )
        });
    });
});