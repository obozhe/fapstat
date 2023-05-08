import { HttpException, HttpStatus } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { UserDocument } from '@m/user/schemas/user.schema';

import verificationCodeTemplate from './templates/verification-code-template';

export default abstract class MailerService {
    public static sendVerificationCode(user: UserDocument, code: string) {
        const options: MailOptions = {
            to: user.email,
            subject: 'Confirmation Code',
            html: verificationCodeTemplate(user.firstName, code),
        };

        return MailerService.send(options);
    }

    private static async send({ from = process.env.MAILER_USER, to, subject, text, html }: MailOptions) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAILER_USER,
                pass: process.env.MAILER_PASSWORD,
            },
            secure: process.env.MAILER_PORT === '465',
        });

        const info: SMTPTransport.SentMessageInfo = await transporter.sendMail({
            from,
            to,
            subject,
            text,
            html,
        });

        if (!info.messageId) {
            throw new HttpException('Mail has not been sent. Try again later', HttpStatus.SERVICE_UNAVAILABLE);
        }
    }
}
