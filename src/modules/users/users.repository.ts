import { Injectable } from '@nestjs/common';
import { User } from './models/user.model'
import { hash } from 'bcrypt';
import { Role } from '../auth/roles/role.enum';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class UsersRepository {
    private users: User[] = [];

    async create(dto: CreateUserDTO): Promise<User | undefined> {
        dto.password = await hash(dto.password, 10);

        let lastId = this.users[this.users.length - 1]?.id;
        if (!lastId) {
            lastId = 0;
        }

        const user: User = {
            ...dto,
            roles: [Role.User],
            id: (lastId + 1),
        };
        this.users.push({ ...user });
        delete user.password;
        return user;
    }

    async findById(id: number): Promise<User | undefined> {
        const index = this.users.findIndex((u) => u.id == id);
        const user = this.users[index];
        return user;
    }

    async findByMail(email: string): Promise<User | undefined> {
        const index = this.users.findIndex((u) => u.email == email);
        const user = this.users[index];
        return user;
    }
}