import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';
import { ApiResponseProperty } from '@nestjs/swagger';
import { User } from '../../users/models/user.model';

export class LoginDTO {
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
}

class _Payload {
    @ApiResponseProperty({ type: String, example: 'ey***.ey***.***' })
    accessToken: string;

    @ApiResponseProperty({ type: String, example: 'ey***.ey***.***' })
    refreshToken: string;

    @ApiResponseProperty({ type: String, example: 'Day, 00 Month yyyy hh:mm:ss GMT' })
    expiresAt: string;
}

export class LoginResponseDTO {
    @ApiResponseProperty({
        type: User
    })
    user: User;

    @ApiResponseProperty({
        type: _Payload
    })
    payload: _Payload;
}