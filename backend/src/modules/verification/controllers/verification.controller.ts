import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import MailerService from 'core/mailer';

import { UserService } from '@m/user/services/user.service';

import { GetVerificationCodeDTO } from '../models/get-verification-code-dto';
import { VerificationTokenCollectionService } from '../services/verification-token-collection.service';

@ApiTags('verification')
@Controller('/api/verification')
export class VerificationController {
    constructor(
        private readonly userService: UserService,
        private readonly verificationTokenCollection: VerificationTokenCollectionService,
    ) {}

    @Get('/code')
    public async sendVerificationCode(@Query() { userId }: GetVerificationCodeDTO) {
        const user = await this.userService.findById(userId);

        await this.verificationTokenCollection.findByUserAndRemove(user._id);

        const token = await this.verificationTokenCollection.create(user._id);
        await MailerService.sendVerificationCode(user, token.token);

        return;
    }
}
