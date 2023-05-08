import { Module } from '@nestjs/common';
import { CategoryModule } from 'modules/category/category.module';

import { EventModule } from '@m/event/event.module';

import { StatsController } from './controllers/stats.controller';
import { StatsService } from './services/stats.service';

@Module({
    imports: [EventModule, CategoryModule],
    controllers: [StatsController],
    providers: [StatsService],
})
export class StatsModule {}
