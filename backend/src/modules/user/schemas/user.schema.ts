import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { HydratedDocument } from 'mongoose';

import { UserRoles } from '../enums/user-roles.enum';

export type UserDocument = HydratedDocument<User>;

class Avatar {
    @Prop({ required: true })
    emoji: string;

    @Prop({ required: true })
    color: string;
}

@Schema({
    timestamps: true,
    toJSON: {
        transform: function (_: UserDocument, ret: UserDocument) {
            ret.id = String(ret._id);
            delete ret._id;
            delete ret.__v;
            delete ret.salt;
            delete ret.password;
            delete ret.verified;
            return ret;
        },
    },
})
export class User {
    @Prop({ unique: true, required: true, lowercase: true, trim: true })
    email: string;

    @Prop({ unique: true, required: true, lowercase: true, trim: true })
    username: string;

    @Prop({ minlength: 8, required: true })
    password: string;

    @Prop({ default: () => bcrypt.genSaltSync(), required: true })
    salt: string;

    @Prop({ minlength: 2, trim: true, required: true })
    firstName: string;

    @Prop({ minlength: 2, trim: true, required: true })
    lastName: string;

    @Prop({ type: String, enum: UserRoles, default: UserRoles.Basic, required: true })
    role: UserRoles;

    @Prop({ default: false, required: true })
    verified: boolean;

    @Prop({ required: true, type: Avatar })
    avatar: Avatar;

    @Prop()
    lastLogin: Date;

    @Prop({ required: true })
    timezone: string;

    public validatePassword(password: string): boolean {
        return bcrypt.compareSync(password, this.password);
    }
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.loadClass(User);
UserSchema.pre<User>(/save/, async function () {
    const user = this as UserDocument;
    user.password = await bcrypt.hash(user.password, user.salt);
});
