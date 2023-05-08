import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomInt } from 'crypto';
import { Model, Types } from 'mongoose';

import { VerificationToken, VerificationTokenDocument } from '../schemas/verification-token.schema';

@Injectable()
export class VerificationTokenCollectionService {
    constructor(
        @InjectModel(VerificationToken.name) private readonly verificationTokenModel: Model<VerificationTokenDocument>,
    ) {}

    public async create(user: Types.ObjectId): Promise<VerificationTokenDocument> {
        return await this.verificationTokenModel.create({
            user,
            token: randomInt(100000, 999999).toString(),
        });
    }

    public async findByUserIdAndToken(user: Types.ObjectId, token: string): Promise<VerificationTokenDocument> {
        return this.verificationTokenModel.findOne({ user, token });
    }

    public async findByUserAndRemove(user: Types.ObjectId): Promise<VerificationTokenDocument> {
        return await this.verificationTokenModel.findOneAndRemove({ user });
    }
}
