import { ApiResponseProperty } from '@nestjs/swagger';
import { Role } from '../../auth/roles/role.enum';

export class User {
    @ApiResponseProperty({ type: Number })
    id: number;
    @ApiResponseProperty({ type: String })
    name: string;
    @ApiResponseProperty({ type: String })
    surname: string;
    @ApiResponseProperty({ type: String, format: 'email' })
    email: string;

    password?: string;

    @ApiResponseProperty({ type: [Role], enum: ['user', 'admin']})
    roles: Role[];
}