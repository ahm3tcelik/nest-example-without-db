import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';
import { User } from '../../users/models/user.model';

export class RegisterDTO {
    @ApiProperty({
        format: 'email',
    })
    @IsEmail()
    readonly email: string;

    @ApiProperty({
        minLength: 6,
        maxLength: 30,
        description: 'Password must be 6-30 characters',
        example: 'secret.123'
    })
    @Length(6, 30, { message: 'Your password must be 6-30 characters' })
    readonly password: string;

    @ApiProperty({
        minLength: 2,
        maxLength: 30,
        description: 'Name must be 2-30 characters',
        example: 'Ahmet'
    })
    @Length(2, 30, { message: 'Your name must be 2-30 characters' })
    name: string;
    
    @ApiProperty({
        minLength: 2,
        maxLength: 30,
        description: 'Surname must be 2-30 characters',
        example: 'Çelik'
    })
    @Length(2, 30, { message: 'Your surname must be 2-30 characters' })
    surname: string;
}

class _Payload {
    @ApiResponseProperty({ type: String, example: 'ey***.ey***.***' })
    accessToken: string;

    @ApiResponseProperty({ type: String, example: 'ey***.ey***.***' })
    refreshToken: string;

    @ApiResponseProperty({ type: String, example: 'Day, 00 Month yyyy hh:mm:ss GMT' })
    expiresAt: string;
}

export class RegisterResponseDTO {
    @ApiResponseProperty({
        type: User
    })
    user: User;

    @ApiResponseProperty({
        type: _Payload
    })
    payload: _Payload;
}