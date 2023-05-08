import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { BannedUser, BannedUserDocument } from '../schemas/banned-user.schema';

@Injectable()
export class BannedUserCollectionService {
    constructor(@InjectModel(BannedUser.name) private readonly bannedUserModel: Model<BannedUserDocument>) {}

    public async create(ids: string[]): Promise<BannedUserDocument[]> {
        const objectIds = ids.map((id) => ({ user: new Types.ObjectId(id) }));
        return await this.bannedUserModel.create(objectIds);
    }

    public async deleteMany(ids: string[]) {
        const objectIds = ids.map((id) => new Types.ObjectId(id));

        return await this.bannedUserModel.deleteMany({ user: { $in: objectIds } });
    }

    public async findAllExceptAdminUser(userId: string): Promise<BannedUserDocument[]> {
        return await this.bannedUserModel.find({ user: { $ne: userId } });
    }

    public async isUserBanned(id: Types.ObjectId): Promise<boolean> {
        const user = await this.bannedUserModel.findOne({ user: id });

        return !!user;
    }

    public async getBannedUsersCount(): Promise<number> {
        return await this.bannedUserModel.count();
    }
}
