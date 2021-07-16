import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { RoleType } from '../../common/constants/role-type';
import { UserDto } from './dto/user-dto';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity<UserDto> {
    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    surname: string;

    @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
    role: RoleType;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: true, default: false })
    verified: boolean;

    dtoClass = UserDto;
}
