import { Injectable, Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { MailerService } from '@nestjs-modules/mailer';

dotenv.config();
const logger = new Logger('EmailService');

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    // context is variable's which we are going to use in mail template
    sendEmail(
        to: string,
        cc: string[],
        bcc: string[],
        subject: string,
        template: string,
        context: Record<string, unknown>,
    ): any {
        this.mailerService
            .sendMail({
                to,
                from: `"IqMining" <${process.env.MAIL_FROM}>`,
                subject,
                template,
                context,
                cc,
                bcc,
            })
            .then((res) => {
                logger.log(res);
            });
        return true;
    }

    sendCalenderEmail(
        sendto: string,
        subject: string,
        template: string,
        context: Record<string, unknown>,
        calendarObj?: Record<string, unknown>,
    ): any {
        const mailOptions = {
            to: sendto,
            from: process.env.MAIL_FROM,
            subject,
            template,
            context,
            alternatives: null,
        };
        if (calendarObj) {
            const alternatives = {
                contentType: 'application/ics',
                content: Buffer.from(calendarObj.toString()),
            };
            mailOptions.alternatives = alternatives;
        }
        this.mailerService
            .sendMail(mailOptions)
            .then((res) => {
                logger.log('Email sent, more details:', res);
            })
            .catch((error) => {
                logger.log('Error sending email, more details', error);
            });
        return true;
    }
}
