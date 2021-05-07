import { Injectable, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { User } from './models/user.model';
import { compare } from 'bcrypt';
import { RegisterDTO } from '../auth/dto/register.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
    constructor(
        private readonly userRepo: UsersRepository) { }

    async validateCredentials(user: User, password: string) {
        return compare(password, user.password);
    }

    async create(dto: RegisterDTO): Promise<User> {
        const isExist = await this.userRepo.findByMail(dto.email);
        if (isExist) {
            throw new UnprocessableEntityException('E-Mail already in use')
        }
        const user = this.userRepo.create(dto);
        if (!user) {
            throw new InternalServerErrorException('Unexpected error occurred')
        }
        return user;
    }

    async findById(id: number): Promise<User | undefined> {
        const user = this.userRepo.findById(id);
        return user;
    }

    async findByMail(email: string): Promise<User | undefined> {
        const user = this.userRepo.findByMail(email);
        return user;
    }
}