import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { User } from '@m/user/schemas/user.schema';

export type VerificationTokenDocument = HydratedDocument<VerificationToken>;

@Schema()
export class VerificationToken {
    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    user: User;

    @Prop({ required: true })
    token: string;

    @Prop(
        raw({
            default: Date.now,
            expires: 200,
            type: Date,
        }),
    )
    expiresAt: Date;
}

export const VerificationTokenSchema = SchemaFactory.createForClass(VerificationToken);
