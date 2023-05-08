import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { DateTime } from 'luxon';
import { Types } from 'mongoose';

import { AchievementsService } from '@m/achievements/services/achievements.service';
import { User } from '@m/auth/decorators/user.decorator';
import { AuthJWTGuard } from '@m/auth/guards/auth-jwt.guard';

import { UserDTO } from '../../user/models/user-dto';
import { CreateEventDTO } from '../models/create-event-dto';
import { EventCollectionService } from '../services/event-collection.service';
import { EventService } from './../services/event.service';

@ApiTags('events')
@ApiCookieAuth()
@UseGuards(AuthJWTGuard)
@Controller('/api/events')
export class EventController {
    constructor(
        private readonly eventCollection: EventCollectionService,
        private readonly eventService: EventService,
        private readonly achievementsService: AchievementsService
    ) {}

    @HttpCode(201)
    @Post()
    public async create(@Body() eventDto: CreateEventDTO, @User() user: UserDTO) {
        const userId = new Types.ObjectId(user.id);
        const event = await this.eventCollection.create({ ...eventDto, user: userId });
        await this.achievementsService.onEventCreate(event, user);
        return event;
    }

    @Get('/calendar')
    public async getCalendarForYear(@Query('year') year: string, @User() user: UserDTO) {
        if (!DateTime.fromISO(year).isValid) {
            throw new HttpException('Year parameter is not valid', HttpStatus.BAD_REQUEST);
        }

        return await this.eventService.getCalendar(user, year);
    }
}
