import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDTO, LoginResponseDTO } from './dto/login.dto';
import { RefreshTokenDTO, RefreshTokenResponseDTO } from './dto/refresh-token.dto.';
import { RegisterDTO, RegisterResponseDTO } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @ApiCreatedResponse({ type: RegisterResponseDTO })
    @Post('register')
    async register(@Body() registerDTO: RegisterDTO): Promise<RegisterResponseDTO> {

        const payload = await this.authService.register(registerDTO);
        return payload;
    }

    @ApiCreatedResponse({ type: LoginResponseDTO })
    @Post('login')
    async login(@Body() loginDTO: LoginDTO): Promise<LoginResponseDTO> {
        const payload = await this.authService.login(loginDTO);
        return payload;
    }

    @ApiCreatedResponse({ type: RefreshTokenResponseDTO })
    @Post('refresh-token')
    async refreshToken(@Body() refreshDTO: RefreshTokenDTO): Promise<RefreshTokenResponseDTO> {
        return this.authService.refreshToken(refreshDTO);
    }

    @ApiCreatedResponse()
    @Post('logout')
    async logout(@Body() refreshDTO: RefreshTokenDTO) {
        await this.authService.logout(refreshDTO);
        return {};
    }
}