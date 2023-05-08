import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { User } from '@m/user/schemas/user.schema';

import { Category } from '../../category/schemas/category.schema';

export type EventDocument = HydratedDocument<Event>;

@Schema({ timestamps: true })
export class Event {
    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    user: Types.ObjectId;

    @Prop({ required: true, min: 0.5, max: 300 })
    duration: number;

    @Prop({ required: true })
    date: Date;

    @Prop({ required: true, min: 1, max: 5 })
    rating: number;

    @Prop([{ required: true, type: Types.ObjectId, ref: Category.name }])
    categories: Types.ObjectId[];

    @Prop({ maxlength: 500, trim: true })
    description: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);
