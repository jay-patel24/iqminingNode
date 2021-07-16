import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Query,
    UseGuards,
    UseInterceptors,
    ValidationPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleType } from '../../common/constants/role-type';
import { PageDto } from '../../common/dto/page.dto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth, UUIDParam } from '../../decorators/http.decorators';
import { TranslationService } from '../../shared/services/translation.service';
import { UserDto } from './dto/user-dto';
import { UsersPageOptionsDto } from './dto/users-page-options.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { Body } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user-dto.dto';
import { AuthGuard } from 'guards/auth.guard';
import { AuthUserInterceptor } from 'interceptors/auth-user-interceptor.service';

@Controller('users')
export class UserController {
    constructor(
        private userService: UserService,
        private readonly translationService: TranslationService,
    ) {}

    @Get('admin')
    @Auth(RoleType.USER)
    @HttpCode(HttpStatus.OK)
    async admin(@AuthUser() user: UserEntity): Promise<string> {
        const translation = await this.translationService.translate(
            'keywords.admin',
            {
                lang: 'en',
            },
        );
        return `${translation} ${user.name}`;
    }

    @Get()
    @Auth(RoleType.USER)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get users list',
        type: PageDto,
    })
    getUsers(
        @Query(new ValidationPipe({ transform: true }))
        pageOptionsDto: UsersPageOptionsDto,
    ): Promise<PageDto<UserDto>> {
        return this.userService.getUsers(pageOptionsDto);
    }

    @Get(':id')
    @Auth(RoleType.USER)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get users list',
        type: UserDto,
    })
    getUser(@UUIDParam('id') userId: string): Promise<UserDto> {
        return this.userService.getUser(userId);
    }

    @Patch('update-user')
    @Auth(RoleType.USER)
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @UseInterceptors(AuthUserInterceptor)
    @ApiOkResponse({ type: UserDto, description: 'Successfully Updated User' })
    async updateUser(
        @AuthUser() user: UserEntity,
        @Body() updateUserDto: Partial<UpdateUserDto>,
    ): Promise<UserDto> {
        console.log(updateUserDto);
        return this.userService.updateUser(user, updateUserDto);
    }

    @Get('verify-email/:email')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: UserDto, description: 'User Successfully Verified' })
    verifyUser(@Param('email') email: string): Promise<any> {
        return this.userService.verifyEmail(email);
    }

    @Get('resend-verification-link/:email')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: UserDto, description: 'Successfully resend link' })
    resendVerificationLink(@Param('email') email: string): Promise<any> {
        return this.userService.sendVerificationLink(email);
    }
}
