import { ApiPropertyOptional } from '@nestjs/swagger';

import { RoleType } from '../../../common/constants/role-type';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { UserEntity } from '../user.entity';

export class UserDto extends AbstractDto {
    @ApiPropertyOptional()
    name: string;

    @ApiPropertyOptional()
    surname: string;

    @ApiPropertyOptional({ enum: RoleType })
    role: RoleType;

    @ApiPropertyOptional()
    email: string;

    constructor(user: UserEntity, options?: Partial<{ isActive: boolean }>) {
        super(user);
        this.name = user.name;
        this.surname = user.surname;
        this.role = user.role;
        this.email = user.email;
    }
}
