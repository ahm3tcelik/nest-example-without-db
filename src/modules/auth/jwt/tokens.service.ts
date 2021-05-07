import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { User } from '../../users/models/user.model';
import { RefreshTokenResponseDTO } from '../dto/refresh-token.dto.';
import { TokensPayload } from '../interfaces/tokens-payload.interface';

@Injectable()
export class TokensService {

    private accessTokens: Map<number, string> = new Map<number, string>();
    private refreshTokens: Map<number, string> = new Map<number, string>();

    constructor(
        private readonly jwt: JwtService
    ) { }

    async generateAcessToken(user: User): Promise<[string, string]> {
        const expiration = new Date();
        const ttl = Number(process.env.ACCESS_EXPIRE)
        expiration.setTime(expiration.getTime() + ttl);

        const options: JwtSignOptions = {
            issuer: process.env.COMPANY,
            audience: String(user.id),
            subject: user.email,
            secret: process.env.JWT_SECRET_ACCESS,
            expiresIn: process.env.ACCESS_EXPIRE
        }

        const payload: TokensPayload = {
            userId: user.id,
            userEmail: user.email
        };

        const accessToken = await this.jwt.signAsync(payload, options);
        this.accessTokens[user.id] = accessToken;
        return [accessToken, expiration.toUTCString()];
    }

    async generateRefreshToken(user: User): Promise<[string, string]> {
        const expiration = new Date();
        const ttl = Number(process.env.ACCESS_EXPIRE)
        expiration.setTime(expiration.getTime() + ttl);

        const options: JwtSignOptions = {
            issuer: process.env.COMPANY,
            audience: String(user.id),
            subject: user.email,
            secret: process.env.JWT_SECRET_REFRESH,
            expiresIn: process.env.REFRESH_EXPIRE
        }

        const payload: TokensPayload = {
            userId: user.id,
            userEmail: user.email
        };
        const refreshToken = await this.jwt.signAsync(payload, options);
        this.refreshTokens[user.id] = refreshToken;
        return [refreshToken, expiration.toUTCString()];
    }

    async getAccessTokenFromRefreshToken(refreshToken: string): Promise<RefreshTokenResponseDTO> {

        let userId = -1, userEmail = '';
        try {
            const payload = await this.jwt.verifyAsync(refreshToken,
                { secret: process.env.JWT_SECRET_REFRESH });
            userId = payload.userId;
            userEmail = payload.userEmail;
        } catch (e) {
            throw new BadRequestException(e)
        }

        if (!this.refreshTokens[userId]) {
            throw new BadRequestException('Invalid refresh token')
        }

        const options: JwtSignOptions = {
            issuer: process.env.COMPANY,
            audience: String(userId),
            subject: userEmail,
            secret: process.env.JWT_SECRET_ACCESS,
            expiresIn: process.env.ACCESS_EXPIRE
        }

        const payload: TokensPayload = { userId, userEmail };
        const accessToken = await this.jwt.signAsync(payload, options);
        this.accessTokens[payload.userId] = accessToken;
        return { accessToken };
    }

    async removeRefreshToken(refreshToken: string): Promise<any> {
        const { userId }: TokensPayload = await this.jwt.verifyAsync(refreshToken,
            { secret: process.env.JWT_SECRET_REFRESH });

        if (!this.refreshTokens[userId]) {
            throw new BadRequestException('Invalid refresh token')
        }
        delete this.refreshTokens[userId];
    }
}