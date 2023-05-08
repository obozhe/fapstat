import { FieldDto } from 'core/types/fieldDto';

export interface DayStatsDto {
    date: string;
    eventsCount: number;
    durationsSum: number;
}

export interface PerDayStatsDto {
    user: DayStatsDto[];
    others: DayStatsDto[];
}

export interface PerDayStats {
    user: number[];
    others: number[];
}

export interface StatsDto {
    averageStats: FieldDto[];
    records: FieldDto[];
    perDayStats: PerDayStatsDto;
}
