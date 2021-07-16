import { ApiPropertyOptional } from '@nestjs/swagger';
import { AbstractDto } from 'common/dto/abstract.dto';
import { UserEntity } from '../user.entity';

export class UpdateUserDto {
    @ApiPropertyOptional() name: string;
    @ApiPropertyOptional() surname: string;
    @ApiPropertyOptional() email: string;
    @ApiPropertyOptional() password: string;
}
