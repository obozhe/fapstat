import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from '@m/user/user.module';

import { VerificationController } from './controllers/verification.controller';
import { VerificationToken, VerificationTokenSchema } from './schemas/verification-token.schema';
import { VerificationTokenCollectionService } from './services/verification-token-collection.service';
import { VerificationService } from './services/verification.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: VerificationToken.name, schema: VerificationTokenSchema }]),
        forwardRef(() => UserModule),
    ],
    controllers: [VerificationController],
    providers: [VerificationTokenCollectionService, VerificationService],
    exports: [VerificationService],
})
export class VerificationModule {}
