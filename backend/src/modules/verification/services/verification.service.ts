import { BadRequestException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { VerificationTokenCollectionService } from './verification-token-collection.service';

@Injectable()
export class VerificationService {
    constructor(private readonly verificationTokenCollection: VerificationTokenCollectionService) {}

    public async verify(userId: Types.ObjectId | string, token: string) {
        const user = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;
        const verificationToken = await this.verificationTokenCollection.findByUserIdAndToken(user, token);

        if (!verificationToken) {
            throw new BadRequestException(
                'Code is not valid or expired. Check your code and email or ask for a new code.',
            );
        }

        return await verificationToken.delete();
    }
}
