import { BadRequestException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { MailService } from 'modules/mail/mail.service';
import type { FindConditions } from 'typeorm';

import type { PageDto } from '../../common/dto/page.dto';
import { AwsS3Service } from '../../shared/services/aws-s3.service';
import { ValidatorService } from '../../shared/services/validator.service';
import type { UserRegisterDto } from '../auth/dto/UserRegisterDto';
import { UpdateUserDto } from './dto/update-user-dto.dto';
import type { UserDto } from './dto/user-dto';
import type { UsersPageOptionsDto } from './dto/users-page-options.dto';
import type { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(
        public readonly userRepository: UserRepository,
        public readonly validatorService: ValidatorService,
        public readonly awsS3Service: AwsS3Service,
        public readonly mailService: MailService,
    ) {}

    /**
     * Find single user
     */
    findOne(findData: FindConditions<UserEntity>): Promise<UserEntity> {
        return this.userRepository.findOne(findData);
    }
    async findByUsernameOrEmail(
        options: Partial<{ username: string; email: string }>,
    ): Promise<UserEntity | undefined> {
        const queryBuilder = this.userRepository.createQueryBuilder('user');

        if (options.email) {
            queryBuilder.orWhere('user.email = :email', {
                email: options.email,
            });
        }
        if (options.username) {
            queryBuilder.orWhere('user.username = :username', {
                username: options.username,
            });
        }
        return queryBuilder.getOne();
    }

    async createUser(userRegisterDto: UserRegisterDto): Promise<UserDto> {
        const user = this.userRepository.create(userRegisterDto);
        const result = await this.userRepository.save(user);

        return result.toDto<typeof UserDto>();
    }

    async sendVerificationLink(email: string): Promise<any> {
        let user = await this.userRepository.findOne({ email });
        if (!user) throw new BadRequestException();

        const link = process.env.BASE_URL + `/users/verify-email/${user.email}`;
        await this.mailService.sendEmail(
            user.email,
            [],
            [],
            'Welcome | iqminingNode',
            './email-verification',
            {
                name: user.name,
                url: link,
            },
        );
    }

    async verifyEmail(email: string): Promise<any> {
        let user = await this.userRepository.findOne({ email });
        if (!user) throw new BadRequestException();
        user.verified = true;
        this.userRepository.save(user);

        return 'Your email has been successfully verified';
    }

    async getUsers(
        pageOptionsDto: UsersPageOptionsDto,
    ): Promise<PageDto<UserDto>> {
        const queryBuilder = this.userRepository.createQueryBuilder('user');
        const { items, pageMetaDto } = await queryBuilder.paginate(
            pageOptionsDto,
        );
        return items.toPageDto(pageMetaDto);
    }

    async getUser(userId: string): Promise<UserDto> {
        const queryBuilder = this.userRepository.createQueryBuilder('user');
        queryBuilder.where('user.id = :userId', { userId });
        const userEntity = await queryBuilder.getOne();
        return userEntity.toDto();
    }

    async updateUser(
        user: UserEntity,
        updateUserDto: Partial<UpdateUserDto>,
    ): Promise<UserDto> {
        if (updateUserDto.name) user.name = updateUserDto.name;
        if (updateUserDto.surname) user.surname = updateUserDto.surname;
        if (updateUserDto.email) user.email = updateUserDto.email;
        if (updateUserDto.password) user.password = updateUserDto.password;

        const result = await this.userRepository.save(user);
        return result.toDto<typeof UserEntity>();
    }
}
