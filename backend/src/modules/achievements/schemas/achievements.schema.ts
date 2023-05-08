import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { User } from '@m/user/schemas/user.schema';

import { AchievementsCodes } from '../enums/achievements-codes';
import { achievements } from './../consts/achievements';

export type AchievementsDocument = HydratedDocument<Achievements>;

class Achievement {
    @Prop({ required: true, type: Date })
    receivedDate: Date;

    @Prop({ required: true, enum: AchievementsCodes, type: String })
    code: AchievementsCodes;
}

@Schema({
    toJSON: {
        transform: function (doc: any, ret: any) {
            ret.achievements = ret.achievements.map((achievement: Achievement) => ({
                ...achievement,
                ...achievements[achievement.code],
            }));
            ret.new = ret.new.map((achievement: Achievement) => ({
                ...achievement,
                ...achievements[achievement.code],
            }));
            delete ret._id;
            delete ret.__v;
            delete ret.user;
            return ret;
        },
    },
})
export class Achievements {
    @Prop({ type: Types.ObjectId, unique: true, ref: User.name, required: true })
    user: Types.ObjectId;

    @Prop([{ type: Achievement }])
    achievements: Achievement[];

    @Prop([{ type: Achievement }])
    new: Achievement[];
}

export const AchievementsSchema = SchemaFactory.createForClass(Achievements);
