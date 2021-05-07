import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt/jwt.strategy';
import { TokensService } from './jwt/tokens.service';
import { RolesGuard } from './roles/roles.guard';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async () => ({
                secret: process.env.JWT_SECRET_ACCESS,
                verifyOptions: {
                    ignoreExpiration: false
                },
                signOptions: {
                    expiresIn: process.env.ACCESS_EXPIRE
                }
            }),
            inject: [ConfigService]
        }),
        UsersModule
    ],
    controllers: [AuthController],
    providers: [AuthService, TokensService, JwtStrategy, RolesGuard]
})
export class AuthModule { }
