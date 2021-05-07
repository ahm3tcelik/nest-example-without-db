import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
    handleRequest(err, user, info: Error) {
        if (err || info || !user) {
            throw new UnauthorizedException(info?.message)
        }
        return user
    }
}