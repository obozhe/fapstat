import { AxiosRequestConfig } from 'axios';
import axios from 'core/axios';

import { CalendarDto, CreateEventDto, EventDto } from '../types/event';

export enum EventsURL {
    createEvent = '/events',
    getEvents = '/events',
    getCalendar = '/events/calendar',
}

export default abstract class EventApi {
    public static createEvent(
        body: CreateEventDto,
        config: AxiosRequestConfig
    ) {
        return axios.post<EventDto, void>(EventsURL.createEvent, body, config);
    }

    public static getEvents(params: Record<string, string>, config: AxiosRequestConfig) {
        return axios.get<EventDto, EventDto[]>(EventsURL.getEvents, { params, ...config });
    }

    public static getCalendar(year: string, config?: AxiosRequestConfig) {
        return axios.get<CalendarDto, CalendarDto>(EventsURL.getCalendar, { params: { year }, ...config });
    }
}
