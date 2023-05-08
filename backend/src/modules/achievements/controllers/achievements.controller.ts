import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import _ from 'lodash';

import { AchievementDTO } from '@m/achievements/models/achievement-dto';
import { User } from '@m/auth/decorators/user.decorator';
import { AuthJWTGuard } from '@m/auth/guards/auth-jwt.guard';
import { UserDTO } from '@m/user/models/user-dto';

import { achievements } from '../consts/achievements';
import { AchievementsCollectionService } from '../services/achievements-collection.service';

@ApiTags('achievements')
@ApiCookieAuth()
@UseGuards(AuthJWTGuard)
@Controller('/api/achievements')
export class AchievementsController {
    constructor(private readonly achievementsCollection: AchievementsCollectionService) {}

    @Get()
    public async getAchievements(@User() user: UserDTO) {
        const userAchievements = (await this.achievementsCollection.findByUser(user.id)).toJSON() as {
            new: AchievementDTO[];
            achievements: AchievementDTO[];
        };
        const receivedAchievements = [...userAchievements.new, ...userAchievements.achievements];

        const allAchievements = Object.values(achievements).map((achievement) => {
            const isAchievementReceived = receivedAchievements.some(
                (receivedAchievement) => receivedAchievement.code === achievement.code
            );
            return isAchievementReceived
                ? achievement
                : { code: 'UNRECEIVED', label: '?????', description: '?????', receivedDate: null };
        });

        return _.sortBy(allAchievements, 'label').reverse();
    }

    @Get('/last')
    public async getLastAchievements(@User() user: UserDTO) {
        const userAchievements = (await this.achievementsCollection.findByUser(user.id)).toJSON();

        return _([...userAchievements.achievements, ...userAchievements.new])
            .sortBy('receivedDate')
            .reverse()
            .take(5);
    }

    @Get('/new')
    public async getNewAchievements(@User() user: UserDTO) {
        const userAchievements = (await this.achievementsCollection.findByUser(user.id)).toJSON();

        return userAchievements.new;
    }

    @Patch('/new/clear')
    public async clearNewAchievements(@User() user: UserDTO) {
        const userAchievements = await this.achievementsCollection.findByUser(user.id);

        userAchievements.achievements = [...userAchievements.achievements, ...userAchievements.new];
        userAchievements.new = [];

        return await userAchievements.save();
    }
}
