import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ResponseSuccess } from 'common/dto/SuccessResponseDto';

import { AuthUser } from '../../decorators/auth-user.decorator';
import { ApiFile } from '../../decorators/swagger.schema';
import { AuthGuard } from '../../guards/auth.guard';
import { AuthUserInterceptor } from '../../interceptors/auth-user-interceptor.service';
import { IFile } from '../../interfaces';
import { UserDto } from '../user/dto/user-dto';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginPayloadDto } from './dto/LoginPayloadDto';
import { UserLoginDto } from './dto/UserLoginDto';
import { UserRegisterDto } from './dto/UserRegisterDto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(
        public readonly userService: UserService,
        public readonly authService: AuthService,
    ) {}

    @Post('register')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: UserDto, description: 'Successfully Registered' })
    @ApiFile({ name: 'avatar' })
    async userRegister(
        @Body() userRegisterDto: UserRegisterDto,
        @UploadedFile() file: IFile,
    ): Promise<ResponseSuccess> {
        const createdUser = await this.userService.createUser(userRegisterDto);
        await this.userService.sendVerificationLink(createdUser.email);
        return new ResponseSuccess(
            'User sucessfully created, a verification link is sent to your email',
            createdUser,
        );
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: LoginPayloadDto,
        description: 'User info with access token',
    })
    async userLogin(
        @Body() userLoginDto: UserLoginDto,
    ): Promise<ResponseSuccess> {
        const userEntity = await this.authService.validateUser(userLoginDto);
        const token = await this.authService.createToken(userEntity);
        const loginPayload = new LoginPayloadDto(userEntity.toDto(), token);
        return new ResponseSuccess('User logged in successfully', loginPayload);
    }

    @Get('me')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @UseInterceptors(AuthUserInterceptor)
    @ApiBearerAuth()
    @ApiOkResponse({ type: UserDto, description: 'current user info' })
    getCurrentUser(@AuthUser() user: UserEntity): UserDto {
        return user.toDto();
    }
}
