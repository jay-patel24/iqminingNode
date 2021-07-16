import { Module, forwardRef } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';

@Module({
    imports: [MailerModule],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {}
