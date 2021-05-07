import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDTO {
    @ApiProperty({
        description: 'Refresh token',
        example: 'ey***.ey***.***',
        format: 'jwt'
    })
    @IsNotEmpty({ message: 'A refresh token is required' })
    readonly refreshToken: string;
}

export class RefreshTokenResponseDTO {
    @ApiResponseProperty({ type: String, example: 'ey***.ey***.***' })
    accessToken: string;
}