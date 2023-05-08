import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { DateTime } from 'luxon';

import { User } from '@m/auth/decorators/user.decorator';
import { AuthJWTGuard } from '@m/auth/guards/auth-jwt.guard';
import { EventService } from '@m/event/services/event.service';
import { UserDTO } from '@m/user/models/user-dto';

import { StatsService } from './../services/stats.service';

@ApiTags('stats')
@ApiCookieAuth()
@UseGuards(AuthJWTGuard)
@Controller('/api/stats')
export class StatsController {
    constructor(private readonly statsService: StatsService, private readonly eventService: EventService) {}

    @Get()
    public async getStatsForMonth(@Query('month') month: string, @User() user: UserDTO) {
        const date = DateTime.fromISO(month);

        if (!date.isValid) {
            throw new BadRequestException('Month parameter is not valid');
        }

        const events = await this.eventService.getEvents(user, month, 'month');

        const perDayStats = this.statsService.getPerDayStats(events, user.timezone);
        const othersPerDayStats = await this.eventService.getOthersPerDayStats(user, month);

        const daysSequences = this.statsService.getDaysSequences(perDayStats, month, user);

        return {
            records: await this.statsService.getMonthRecords(events, perDayStats, daysSequences),
            averageStats: this.statsService.getMonthAverageStats(events.length, date.daysInMonth),
            perDayStats: {
                user: perDayStats,
                others: othersPerDayStats,
            },
        };
    }
}
