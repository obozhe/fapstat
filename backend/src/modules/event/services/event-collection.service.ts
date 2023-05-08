import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DateTime } from 'luxon';
import { Model, Types } from 'mongoose';

import { DayStats } from '@m/stats/models/day-stats';

import { CreateEventDTO } from '../models/create-event-dto';
import { EventDocument } from '../schemas/event.schema';
import { Event } from '../schemas/event.schema';

@Injectable()
export class EventCollectionService {
    constructor(@InjectModel(Event.name) private eventModel: Model<EventDocument>) {}

    public async create(event: CreateEventDTO & { user: Types.ObjectId }): Promise<EventDocument> {
        return await this.eventModel.create({ ...event, date: DateTime.fromISO(event.date).toJSDate() });
    }

    public async getEvents(user: Types.ObjectId, start: Date, end: Date): Promise<EventDocument[]> {
        return await this.eventModel.find({
            user,
            date: { $gte: start, $lte: end },
        });
    }

    public async getEventsCount(user: Types.ObjectId): Promise<number> {
        return await this.eventModel.find({ user }).count();
    }

    public async getAllUsedCategories(user: Types.ObjectId): Promise<{ _id: string }[]> {
        return await this.eventModel.aggregate().match({ user }).unwind('categories').group({
            _id: '$categories',
        });
    }

    public async getEventsGroupedByDay(user: Types.ObjectId, timezone: string, start: Date, end: Date) {
        return await this.eventModel
            .aggregate()
            .match({ date: { $gte: start, $lte: end }, user })
            .group({
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$date', timezone: timezone } },
                date: { $first: '$date' },
                events: { $push: '$_id' },
            })
            .sort({ _id: 1 });
    }

    public async getCalendar(user: Types.ObjectId, timezone: string, start: Date, end: Date) {
        return await this.eventModel
            .aggregate()
            .match({ date: { $gte: start, $lte: end }, user })
            .group({
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$date', timezone: timezone } },
                date: { $first: '$date' },
                eventsCount: { $sum: 1 },
                avgRating: { $avg: '$rating' },
                avgDuration: { $avg: '$duration' },
            })
            .sort({ _id: 1 })
            .group({
                _id: { $dateToString: { format: '%Y-%m', date: '$date', timezone: timezone } },
                events: {
                    $push: {
                        date: '$_id',
                        eventsCount: '$eventsCount',
                        avgRating: '$avgRating',
                        avgDuration: '$avgDuration',
                    },
                },
            })
            .sort({ _id: 1 });
    }

    public async getPerDayStatsForOtherUsers(
        user: Types.ObjectId,
        timezone: string,
        start: Date,
        end: Date
    ): Promise<DayStats[]> {
        return await this.eventModel
            .aggregate<DayStats>()
            .match({
                date: { $gte: start, $lte: end },
                user: { $ne: user },
            })
            .group({
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$date', timezone } },
                eventsTotal: { $sum: 1 },
                durationsSum: { $sum: '$duration' },
                usersList: { $addToSet: '$user' },
            })
            .project({
                date: '$_id',
                _id: 0,
                eventsCount: {
                    $cond: [
                        { $eq: [{ $size: '$usersList' }, 0] },
                        0,
                        { $divide: ['$eventsTotal', { $size: '$usersList' }] },
                    ],
                },
                durationsSum: {
                    $cond: [
                        {
                            $or: [{ $eq: [{ $size: '$usersList' }, 0] }, { $eq: ['$eventsTotal', 0] }],
                        },
                        0,
                        { $divide: ['$durationsSum', { $size: '$usersList' }] },
                    ],
                },
            })
            .sort({ date: 1 });
    }
}
