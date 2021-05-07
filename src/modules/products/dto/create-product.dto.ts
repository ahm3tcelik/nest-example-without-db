import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Length } from 'class-validator';

export class CreateProductDTO {
    @Length(3, 30)
    @ApiProperty({
        minLength: 3,
        maxLength: 30,
        type: String
    })
    readonly title: string;

    @Length(3, 200)
    @ApiProperty({
        minLength: 3,
        maxLength: 200,
        type: String
    })
    readonly description: string;

    @IsNumber()
    @ApiProperty({
        type: Number,
        example: 0.0
    })
    readonly price: number;
}