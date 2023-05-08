import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { User } from '@m/user/schemas/user.schema';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({
    timestamps: true,
    toJSON: {
        transform: function (doc: any, ret: any) {
            ret.id = String(ret._id);
            ret.groupBy = ret.user ? 'custom' : 'general';
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
})
export class Category {
    @Prop({ type: Types.ObjectId, ref: User.name, default: null })
    user: Types.ObjectId | null;

    @Prop({ required: true })
    value: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
