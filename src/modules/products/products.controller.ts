import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt/jwt-guard';
import { Role } from '../auth/roles/role.enum';
import { Roles } from '../auth/roles/roles.decorator';
import { RolesGuard } from '../auth/roles/roles.guard';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { Product } from './models/product.model';
import { ProductsService } from './products.service';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
@UseGuards(JwtGuard, RolesGuard)
export class ProductsController {
    constructor(private readonly productService: ProductsService) { }

    @ApiCreatedResponse({ type: Product })
    @Post()
    async create(@Body() createProductDTO: CreateProductDTO): Promise<Product> {
        const result = await this.productService.create(createProductDTO);
        return result;
    }

    @ApiOkResponse({ type: Product, isArray: true })
    @Get()
    async findAll(
        @Query('limit') limit?: number,
        @Query('afterId') afterId?: number
    ): Promise<Product[]> {
        const products = await this.productService.findAll(afterId, limit);
        return products;
    }

    @ApiOkResponse({ type: Product })
    @Patch(':id')
    async updateOne(
        @Param('id') id: number,
        @Body() updateProductDTO: UpdateProductDTO
    ) {
        const updatedProduct = await this.productService.updateOne(id, updateProductDTO);
        return updatedProduct;
    }

    @ApiOkResponse({ type: Product })
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Product> {
        const product = await this.productService.findOne(id);
        return product;
    }

    @Delete(':id')
    @ApiOkResponse({ type: Product })
    @Roles(Role.Admin)
    async deleteOne(@Param('id') id: number): Promise<Product> {
        const deletedProduct = await this.productService.deleteOne(id);
        return deletedProduct;
    }
}