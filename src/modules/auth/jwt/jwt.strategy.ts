import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport/dist';
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { User } from '../../users/models/user.model';
import { UsersService } from '../../users/users.service';
import { TokensPayload } from '../interfaces/tokens-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secret: process.env.JWT_SECRET_ACCESS,
            secretOrKey: process.env.JWT_SECRET_ACCESS,
            signOptions: {
                expiresIn: process.env.ACCESS_EXPIRE,
            },
        })
    }

    async validate(payload: TokensPayload): Promise<User> {
        const { userId } = payload;
        const user = await this.usersService.findById(userId);
        if (!user) {
            return null;
        }
        return user;
    }

}