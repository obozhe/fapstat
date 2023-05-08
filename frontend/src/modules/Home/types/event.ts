export interface EventDto {
    id: string;
    date: string;
    description?: string;
    rating: number;
}

export interface CreateEventDto {
    description?: string;
    rating: number;
    date: string;
    categories: string[];
}

export interface CalendarEvent {
    date: string;
    eventsCount: number;
    avgRating: number;
    avgDuration: number;
}

export interface MonthDto {
    _id: string;
    events: CalendarEvent[];
}

export type CalendarDto = Array<MonthDto>;
