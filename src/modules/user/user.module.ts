import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'modules/auth/auth.module';
import { MailModule } from 'modules/mail/mail.module';

import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
    imports: [
        //forwardRef(() => AuthModule),
        TypeOrmModule.forFeature([UserRepository]),
        MailModule,
    ],
    controllers: [UserController],
    exports: [UserService],
    providers: [UserService],
})
export class UserModule {}
