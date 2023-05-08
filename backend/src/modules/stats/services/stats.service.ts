import { Injectable } from '@nestjs/common';
import { longestSequence } from 'helpers/array.helper';
import _ from 'lodash';
import { DateTime } from 'luxon';

import { CategoryService } from '@m/category/services/category.service';
import { EventDocument } from '@m/event/schemas/event.schema';
import { MostPopularCategory } from '@m/stats/models/most-popular-category';
import { UserDTO } from '@m/user/models/user-dto';

import { DayStats } from '../models/day-stats';

type DaySequences = { eventDaysInRow: number; noEventDaysInRow: number };

@Injectable()
export class StatsService {
    private readonly HOURS_IN_DAY = 24;
    private readonly DAYS_IN_WEEK = 7;

    constructor(private readonly categoryService: CategoryService) {}

    public getPerDayStats(events: EventDocument[], timezone: string): DayStats[] {
        return _.chain(events)
            .reduce((acc, event) => {
                const date = DateTime.fromJSDate(event.date).setZone(timezone).toISODate();
                return {
                    ...acc,
                    [date]: {
                        date,
                        durationsSum: (acc[date]?.durationsSum || 0) + event.duration,
                        eventsCount: (acc[date]?.eventsCount || 0) + 1,
                    },
                };
            }, {} as Record<string, DayStats>)
            .values()
            .sort((a, b) => a.date.localeCompare(b.date))
            .value();
    }

    public getMonthAverageStats(eventsCount: number, daysCount: number) {
        return [
            { label: 'faps per hour', value: eventsCount / (daysCount * this.HOURS_IN_DAY) },
            { label: 'faps per day', value: eventsCount / daysCount },
            { label: 'faps per week', value: eventsCount / (daysCount / this.DAYS_IN_WEEK) },
            { label: 'faps per month', value: eventsCount },
        ];
    }

    public getDaysSequences(perDayStats: DayStats[], month: string, user: UserDTO) {
        const userCreatedDate = DateTime.fromISO(user.createdAt).setZone(user.timezone).toUTC();
        const monthDate = DateTime.fromISO(month);

        const today = DateTime.now().setZone(user.timezone).toUTC();

        const daysWithEvents = perDayStats.map((day) => DateTime.fromISO(day.date).day - 1);
        const hasEventsDays = Array.from({ length: monthDate.daysInMonth }).map((_, i) => daysWithEvents.includes(i));

        const isTodayInMonth = today.month === monthDate.month && today.year === monthDate.year;
        if (isTodayInMonth) {
            hasEventsDays.splice(today.day, monthDate.daysInMonth - today.day);
        }

        const isUserCreatedInMonth =
            userCreatedDate.month === monthDate.month && userCreatedDate.year === monthDate.year;
        if (isUserCreatedInMonth) {
            hasEventsDays.splice(0, userCreatedDate.day - 1);
        }

        const eventDaysInRow = longestSequence(hasEventsDays, (hasEvents) => hasEvents);
        const noEventDaysInRow = longestSequence(hasEventsDays, (hasEvents) => !hasEvents);

        return { eventDaysInRow, noEventDaysInRow };
    }

    public async getMonthRecords(events: EventDocument[], perDayStats: DayStats[], sequences: DaySequences) {
        const mostPopularCategory = await this.getMostPopularCategoryInMonth(events);

        return [
            { label: 'max faps in one day', value: this.getMaxEventsCountInDay(perDayStats) },
            { label: 'max fap duration', value: this.getMaxDuration(events) },
            { label: `fap day${sequences.eventDaysInRow !== 1 ? 's' : ''} in a row`, value: sequences.eventDaysInRow },
            {
                label: `no fap day${sequences.noEventDaysInRow !== 1 ? 's' : ''} in a row`,
                value: sequences.noEventDaysInRow,
            },
            {
                label: `time${mostPopularCategory.count !== 1 ? 's' : ''} selected ${mostPopularCategory.category}`,
                value: mostPopularCategory.count,
            },
            { label: 'words used to define experience', value: this.getDescriptionWordsSum(events) },
        ];
    }

    private getMaxEventsCountInDay(perDayStats: DayStats[]): number {
        return perDayStats?.length ? _(perDayStats).maxBy('eventsCount').eventsCount : 0;
    }

    private getMaxDuration(events: EventDocument[]): number {
        return events?.length ? _(events).maxBy('duration').duration : 0;
    }

    private getDescriptionWordsSum(events: EventDocument[]): number {
        return events?.length ? _(events).map('description').filter().map(_.words).map('length').sum() : 0;
    }

    private async getMostPopularCategoryInMonth(events: EventDocument[]): Promise<MostPopularCategory> {
        const categories = _(events).flatMap('categories').value();
        const mostPopularCategory = _(categories).countBy().entries().maxBy(_.last);

        if (!mostPopularCategory) {
            return { category: 'any category', count: 0 };
        }

        return {
            category: await this.categoryService.getValueById(mostPopularCategory[0]),
            count: mostPopularCategory[1],
        };
    }
}
