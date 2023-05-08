import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DateTime } from 'luxon';
import { Model, Types } from 'mongoose';

import { AchievementsCodes } from '../enums/achievements-codes';
import { Achievements, AchievementsDocument } from '../schemas/achievements.schema';

@Injectable()
export class AchievementsCollectionService {
    constructor(@InjectModel(Achievements.name) private userAchievementsModel: Model<AchievementsDocument>) {}

    public initUser(user: Types.ObjectId): Promise<AchievementsDocument> {
        return this.userAchievementsModel.create({
            user,
            achievements: [],
            new: [{ code: AchievementsCodes.WELCOME, receivedDate: DateTime.now().toUTC().toJSDate() }],
        });
    }

    public async findByUser(id: string | Types.ObjectId): Promise<AchievementsDocument> {
        const user = typeof id === 'string' ? new Types.ObjectId(id) : id;

        return await this.userAchievementsModel.findOne({ user });
    }
}
