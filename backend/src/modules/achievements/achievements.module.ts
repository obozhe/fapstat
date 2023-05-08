import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CategoryModule } from '@m/category/category.module';
import { EventModule } from '@m/event/event.module';

import { AchievementsController } from './controllers/achievements.controller';
import { Achievements, AchievementsSchema } from './schemas/achievements.schema';
import { AchievementsCollectionService } from './services/achievements-collection.service';
import { AchievementsService } from './services/achievements.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Achievements.name, schema: AchievementsSchema }]),
        forwardRef(() => EventModule),
        CategoryModule,
    ],
    controllers: [AchievementsController],
    providers: [AchievementsCollectionService, AchievementsService],
    exports: [AchievementsService],
})
export class AchievementsModule {}
