import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AchievementsModule } from '@m/achievements/achievements.module';

import { EventController } from './controllers/event.controller';
import { Event, EventSchema } from './schemas/event.schema';
import { EventCollectionService } from './services/event-collection.service';
import { EventService } from './services/event.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
        forwardRef(() => AchievementsModule),
    ],
    controllers: [EventController],
    providers: [EventCollectionService, EventService],
    exports: [EventService],
})
export class EventModule {}
