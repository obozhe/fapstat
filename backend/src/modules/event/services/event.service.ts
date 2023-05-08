import { Injectable } from '@nestjs/common';
import { DateTime, DateTimeUnit } from 'luxon';
import { Types } from 'mongoose';

import { DayStats } from '@m/stats/models/day-stats';
import { UserDTO } from '@m/user/models/user-dto';

import { EventDocument } from '../schemas/event.schema';
import { EventCollectionService } from './event-collection.service';

@Injectable()
export class EventService {
    constructor(private readonly eventCollection: EventCollectionService) {}

    public getCalendar({ id, timezone }: UserDTO, year: string) {
        const date = DateTime.fromISO(year);

        const start = date.startOf('year').setZone(timezone, { keepLocalTime: true }).toUTC().toJSDate();
        const end = date.endOf('year').setZone(timezone, { keepLocalTime: true }).toUTC().toJSDate();

        const user = new Types.ObjectId(id);

        return this.eventCollection.getCalendar(user, timezone, start, end);
    }

    public getEvents({ id, timezone }: UserDTO, dateISO: string, period: DateTimeUnit): Promise<EventDocument[]> {
        const date = DateTime.fromISO(dateISO);

        const start = date.startOf(period).setZone(timezone, { keepLocalTime: true }).toUTC().toJSDate();
        const end = date.endOf(period).setZone(timezone, { keepLocalTime: true }).toUTC().toJSDate();

        const user = new Types.ObjectId(id);

        return this.eventCollection.getEvents(user, start, end);
    }

    public getEventsForLastWeek({ id, timezone }: UserDTO, date: Date) {
        const start = DateTime.fromJSDate(date)
            .minus({ days: 7 })
            .setZone(timezone, { keepLocalTime: true })
            .toUTC()
            .toJSDate();
        const end = DateTime.fromJSDate(date).setZone(timezone, { keepLocalTime: true }).toUTC().toJSDate();

        const user = new Types.ObjectId(id);

        return this.eventCollection.getEventsGroupedByDay(user, timezone, start, end);
    }

    public getOthersPerDayStats({ id, timezone }: UserDTO, month: string): Promise<DayStats[]> {
        const date = DateTime.fromISO(month);

        const start = date.startOf('month').setZone(timezone, { keepLocalTime: true }).toUTC().toJSDate();
        const end = date.endOf('month').setZone(timezone, { keepLocalTime: true }).toUTC().toJSDate();

        const user = new Types.ObjectId(id);

        return this.eventCollection.getPerDayStatsForOtherUsers(user, timezone, start, end);
    }

    public getUserEventsCount(user: Types.ObjectId): Promise<number> {
        return this.eventCollection.getEventsCount(user);
    }

    public getAllUsedCategories(id: string): Promise<string[]> {
        const user = new Types.ObjectId(id);

        return this.eventCollection.getAllUsedCategories(user).then((result) => result.map(({ _id }) => _id));
    }
}
