import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { User } from './user.schema';

export type BannedUserDocument = HydratedDocument<BannedUser>;

@Schema()
export class BannedUser {
    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    user: Types.ObjectId;
}

export const BannedUserSchema = SchemaFactory.createForClass(BannedUser);
