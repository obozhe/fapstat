import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { DateTime } from 'luxon';
import { Types } from 'mongoose';

import { CategoryService } from '@m/category/services/category.service';
import { EventDocument } from '@m/event/schemas/event.schema';
import { EventService } from '@m/event/services/event.service';
import { UserDTO } from '@m/user/models/user-dto';

import { AchievementsDocument } from '../schemas/achievements.schema';
import { AchievementsCodes } from './../enums/achievements-codes';
import { AchievementsCollectionService } from './achievements-collection.service';

@Injectable()
export class AchievementsService {
    constructor(
        private readonly achievementsCollection: AchievementsCollectionService,
        private readonly eventService: EventService,
        private readonly categoryService: CategoryService
    ) {}

    public initUser(user: Types.ObjectId): Promise<AchievementsDocument> {
        return this.achievementsCollection.initUser(user);
    }

    public async onEventCreate(event: EventDocument, user: UserDTO) {
        const eventAchievements = [
            AchievementsCodes.ROOKIE,
            AchievementsCodes.ENDURANCE_TRAINING,
            AchievementsCodes.CONSISTENT,
            AchievementsCodes.VIRTUOSO,
            AchievementsCodes.ADVENTUROUS,
            AchievementsCodes.RELIABLE,
            AchievementsCodes.EARLY_RISER,
            AchievementsCodes.RELAXED,
            AchievementsCodes.FANATIC,
            AchievementsCodes.SEX_GIANT,
            AchievementsCodes.CREATIVE,
            AchievementsCodes.IMPRESSIVE_STAMINA,
        ];
        const userAchievements = await this.achievementsCollection.findByUser(event.user);
        const receivedAchievements = [...userAchievements.achievements, ...userAchievements.new].map(
            ({ code }) => code
        );

        const notReceivedAchievements = _.difference(eventAchievements, receivedAchievements);

        const newAchievements = [];

        const add = (code: AchievementsCodes) => {
            if (!receivedAchievements.includes(code) && !newAchievements.includes(code)) {
                newAchievements.push(code);
            }
        };

        for (const achievement of notReceivedAchievements) {
            switch (achievement) {
                case AchievementsCodes.ROOKIE: // 1st time
                case AchievementsCodes.SEX_GIANT: // 500 times overall
                    const count = await this.eventService.getUserEventsCount(event.user);

                    if (count === 1) {
                        add(AchievementsCodes.ROOKIE);
                    }

                    if (count === 500) {
                        add(AchievementsCodes.SEX_GIANT);
                    }

                    break;

                case AchievementsCodes.ENDURANCE_TRAINING: // 5 in day
                case AchievementsCodes.IMPRESSIVE_STAMINA: // 10 in a day
                    const day = DateTime.fromJSDate(event.date).toISODate();
                    const dayEvents = await this.eventService.getEvents(user, day, 'day');

                    if (dayEvents.length >= 5 && dayEvents.length < 10) {
                        add(AchievementsCodes.ENDURANCE_TRAINING);
                    }

                    if (dayEvents.length >= 10) {
                        add(AchievementsCodes.IMPRESSIVE_STAMINA);
                    }

                    break;

                case AchievementsCodes.CONSISTENT: // 30 in month
                case AchievementsCodes.FANATIC: // 100 in month
                    const month = DateTime.fromJSDate(event.date).toISODate();
                    const monthEvents = await this.eventService.getEvents(user, month, 'month');

                    if (monthEvents.length >= 30 && monthEvents.length < 100) {
                        add(AchievementsCodes.CONSISTENT);
                    }

                    if (monthEvents.length >= 100) {
                        add(AchievementsCodes.FANATIC);
                    }

                    break;

                case AchievementsCodes.VIRTUOSO:
                    if (event.duration > 20) {
                        add(AchievementsCodes.VIRTUOSO);
                    }
                    break;

                case AchievementsCodes.ADVENTUROUS: // tried all Categories
                    const usedCategories = await this.eventService.getAllUsedCategories(user.id);
                    const generalCategories = await this.categoryService.getGeneralCategoriesIds();

                    if (generalCategories.every((generalCategory) => usedCategories.includes(generalCategory))) {
                        add(AchievementsCodes.ADVENTUROUS);
                    }
                    break;

                case AchievementsCodes.RELIABLE: // every day for a week
                    const lastWeekEventsGroupedByDays = await this.eventService.getEventsForLastWeek(user, event.date);
                    if (lastWeekEventsGroupedByDays.length === 7) {
                        add(AchievementsCodes.RELIABLE);
                    }

                    break;

                case AchievementsCodes.EARLY_RISER: // morning
                case AchievementsCodes.RELAXED: // evening
                    const hour = DateTime.fromJSDate(event.date).setZone(user.timezone).hour;

                    if (hour >= 5 && hour <= 9) {
                        add(AchievementsCodes.EARLY_RISER);
                    }

                    if (hour >= 22 && hour <= 1) {
                        add(AchievementsCodes.RELAXED);
                    }

                    break;

                case AchievementsCodes.CREATIVE: // created new category
                    const userCategoriesCount = await this.categoryService.getCategoriesCountByUser(user.id);

                    if (userCategoriesCount) {
                        add(AchievementsCodes.CREATIVE);
                    }

                    break;
            }
        }

        userAchievements.new = [
            ...userAchievements.new,
            ...newAchievements.map((code) => ({ code, receivedDate: DateTime.now().toUTC().toJSDate() })),
        ];
        await userAchievements.save();
    }
}
