import { Test } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDTO, LoginResponseDTO } from './dto/login.dto';
import { RefreshTokenDTO, RefreshTokenResponseDTO } from './dto/refresh-token.dto.';
import { RegisterDTO, RegisterResponseDTO } from './dto/register.dto';
import { TokensService } from './jwt/tokens.service';
import { Role } from './roles/role.enum';

const registerDTO: RegisterDTO = {
    email: 'ahm@gmail.com',
    name: 'Ahmet',
    surname: 'Çelik',
    password: '123456'
};

const registerPayload: RegisterResponseDTO = {
    payload: {
        accessToken: 'accessToken123',
        refreshToken: 'refreshTokenexample',
        expiresAt: '2022'
    },
    user: { id: 1, name: 'Ahmet', surname: 'Çelik', email: 'ahm@gmail.com', roles: [Role.User] }
};

const loginDTO: LoginDTO = {
    email: 'ahm@gmail.com',
    password: '123456'
}

const refreshPayload: RefreshTokenResponseDTO = { accessToken: 'new access token' };

describe('AuthContorller', () => {
    let authController: AuthController;
    let authService: AuthService;
    let tokensService: TokensService;
    let usersService: UsersService;

    const mockAuthService = {
        register: jest.fn((_: RegisterDTO): Promise<RegisterResponseDTO> => Promise.reject(registerPayload)),
        login: jest.fn((_: LoginDTO): Promise<LoginResponseDTO> => Promise.reject(registerPayload)),
        refreshToken: jest.fn((_: RefreshTokenDTO): Promise<RefreshTokenResponseDTO> => Promise.reject(refreshPayload)),
        logout: jest.fn()
    }

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                { provide: AuthService, useValue: mockAuthService },
            ]
        }).compile();

        authService = moduleRef.get<AuthService>(AuthService);
        authController = moduleRef.get<AuthController>(AuthController);
    });

    describe('register', () => {
        it('should be register', async () => {
            const payload = await authController.register(registerDTO);
            console.table(payload);
            expect(payload).toBeDefined()
        });
    });
});