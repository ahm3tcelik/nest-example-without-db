import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokensService } from './jwt/tokens.service';
import { LoginDTO, LoginResponseDTO } from './dto/login.dto';
import { RefreshTokenDTO, RefreshTokenResponseDTO } from './dto/refresh-token.dto.';
import { RegisterDTO, RegisterResponseDTO } from './dto/register.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly tokensService: TokensService
    ) { }
    async register(dto: RegisterDTO): Promise<RegisterResponseDTO> {
        const user = await this.usersService.create(dto);

        const [refreshToken, refreshExpiresAt] = await this.tokensService.generateRefreshToken(user);
        const [accessToken, _] = await this.tokensService.generateAcessToken(user);

        return {
            user: user,
            payload: {
                accessToken: accessToken,
                refreshToken: refreshToken,
                expiresAt: refreshExpiresAt
            }
        }
    }

    async login(dto: LoginDTO): Promise<LoginResponseDTO> {
        const user = await this.usersService.findByMail(dto.email);
        if (!user) {
            throw new UnauthorizedException('E-mail is not exist')
        }
        const isValid = await this.usersService.validateCredentials(user, dto.password);
        if (!isValid) {
            throw new UnauthorizedException('E-mail or password is incorrect')
        }

        const [refreshToken, refreshExpiresAt] = await this.tokensService.generateRefreshToken(user);
        const [accessToken, _] = await this.tokensService.generateAcessToken(user);

        return {
            user: user,
            payload: {
                accessToken: accessToken,
                refreshToken: refreshToken,
                expiresAt: refreshExpiresAt
            }
        };
    }

    async refreshToken(dto: RefreshTokenDTO): Promise<RefreshTokenResponseDTO> {
        return this.tokensService.getAccessTokenFromRefreshToken(dto.refreshToken);
    }

    async logout(dto: RefreshTokenDTO): Promise<void> {
        return this.tokensService.removeRefreshToken(dto.refreshToken);
    }
}