import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { VerificationModule } from '@m/verification/verification.module';

import { AdminController } from './controllers/admin.controller';
import { MeController } from './controllers/me.controller';
import { UserController } from './controllers/user.controller';
import { BannedUser, BannedUserSchema } from './schemas/banned-user.schema';
import { User, UserSchema } from './schemas/user.schema';
import { BannedUserCollectionService } from './services/banned-user-collection.service';
import { UserCollectionService } from './services/user-collection.service';
import { UserService } from './services/user.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: BannedUser.name, schema: BannedUserSchema },
        ]),
        forwardRef(() => VerificationModule),
    ],
    controllers: [UserController, AdminController, MeController],
    providers: [UserCollectionService, BannedUserCollectionService, UserService],
    exports: [UserService],
})
export class UserModule {}
