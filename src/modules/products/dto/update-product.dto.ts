import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class UpdateProductDTO {
    @Length(3, 30)
    @IsOptional()
    @ApiProperty({
        minLength: 3,
        maxLength: 30,
        type: String,
        required: false
    })
    readonly title?: string;

    @Length(3, 200)
    @IsOptional()
    @ApiProperty({
        minLength: 3,
        maxLength: 200,
        type: String,
        required: false
    })
    readonly description?: string;

    @IsNumber()
    @IsOptional()
    @ApiProperty({
        type: Number,
        example: 0.0,
        required: false
    })
    readonly price?: number;
}