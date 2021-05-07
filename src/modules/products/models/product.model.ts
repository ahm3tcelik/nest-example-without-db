import { ApiProperty } from "@nestjs/swagger";

export class Product {
    @ApiProperty({ type: Number })
    id: number;

    @ApiProperty({ type: String })
    title: string;

    @ApiProperty({ type: String })
    description: string;

    @ApiProperty({ type: Number, example: 0.0 })
    price: number;
}