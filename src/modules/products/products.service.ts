import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDTO } from './dto/create-product.DTO';
import { UpdateProductDTO } from './dto/update-product.DTO';
import { Product } from './models/product.model';

@Injectable()
export class ProductsService {
    private products: Product[] = [
        { id: 1, title: 'Sandlye', description: 'açıklama1', price: 20.5 },
        { id: 2, title: 'Kırmızı Sandlye', description: 'açıklama1', price: 20.1 },
        { id: 3, title: 'Mavi Sandlye', description: 'açıklama1', price: 10.5 },
        { id: 4, title: 'Mor Sandlye', description: 'açıklama1', price: 30.5 },
        { id: 5, title: 'yeşill Sandlye', description: 'açıklama1', price: 20.1 },
        { id: 6, title: 'nefis Sandlye', description: 'açıklama1', price: 20.1 },
        { id: 7, title: 'acı Sandlye', description: 'açıklama1', price: 20.1 },
        { id: 8, title: 'tatlı Sandlye', description: 'açıklama1', price: 20.1 },
        { id: 9, title: 'eksşi Sandlye', description: 'açıklama1', price: 20.1 },
        { id: 10, title: 'haha Sandlye', description: 'açıklama1', price: 20.1 },
    ];

    async create(dto: CreateProductDTO): Promise<Product> {
        let lastId = this.products[this.products.length - 1]?.id;
        if (!lastId) {
            lastId = 0;
        }

        const product: Product = {
            ...dto,
            id: (lastId + 1),
        };
        this.products.push(product);
        return product;
    }

    async findAll(afterId: number = 0, limit: number = Number.POSITIVE_INFINITY): Promise<Product[]> {
        let startIndex = 0;
        if (afterId) {
            startIndex = this.products.findIndex((p) => p.id == afterId) + 1;
        }

        let result: Product[] = [];
        let counter = 0;
        for (let i = startIndex; i < this.products.length; i++) {
            result.push(this.products[i]);
            counter++;
            if (counter >= limit) {
                break;
            }
        }
        return result;
    }

    async findOne(id: number): Promise<Product> {
        let [product, _] = this.findProduct(id);
        return { ...product };
    }

    async updateOne(id: number, DTO: UpdateProductDTO): Promise<Product> {
        const [product, index] = this.findProduct(id);
        this.products[index] = { ...product, ...DTO };
        return this.products[index];
    }

    async deleteOne(id: number): Promise<Product> {
        const [product, index] = this.findProduct(id);
        this.products.splice(index, 1);
        return product;
    }

    private findProduct(id: number): [Product, number] {
        const index = this.products.findIndex((p) => p.id == id);
        const product = this.products[index];
        if (!product) {
            throw new NotFoundException('Could not find product');
        }
        return [product, index];
    }
}