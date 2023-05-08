import dayjs from 'dayjs';

import { PerDayStatsDto } from '../types/stats';
import { DayStatsDto } from './../types/stats';

const getMappedDaysInMonth = (month: string) => {
    const daysInMonth = dayjs(month).daysInMonth();
    return Array.from({ length: daysInMonth }, (v, i) => i + 1).reduce(
        (acc: { [date: string]: number }, _, i) => ({
            ...acc,
            [`${month}-${String(i + 1).padStart(2, '0')}`]: 0,
        }),
        {}
    );
};

const getPerDayData = (dayStats: DayStatsDto[], month: string) => {
    const eventsCounts = getMappedDaysInMonth(month);
    const durationsSums = getMappedDaysInMonth(month);

    dayStats.forEach(({ date, eventsCount, durationsSum }) => {
        eventsCounts[date] = eventsCount;
        durationsSums[date] = durationsSum;
    });

    return {
        eventsCounts: Object.values(eventsCounts),
        durationsSums: Object.values(durationsSums),
    };
};

export const formatPerDayStats = (perDayStats: PerDayStatsDto | undefined, month: string) => {
    if (!perDayStats) {
        const emptyArray = Array.from({ length: dayjs(month).daysInMonth() }, () => 0);
        return {
            eventsCounts: { user: emptyArray, others: emptyArray },
            durationsSums: { user: emptyArray, others: emptyArray },
        };
    }

    const user = getPerDayData(perDayStats.user, month);
    const others = getPerDayData(perDayStats.others, month);

    return {
        eventsCounts: {
            user: user.eventsCounts,
            others: others.eventsCounts,
        },
        durationsSums: {
            user: user.durationsSums,
            others: others.durationsSums,
        },
    };
};
