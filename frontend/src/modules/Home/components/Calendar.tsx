import Tooltip from '@ui/Tooltip';
import { DateFormats } from 'core/enums/DateFormats';
import { DialogNames } from 'core/enums/DialogNames';
import dayjs from 'dayjs';
import { getCurrentYear, getMonthsArray } from 'helpers/date';
import { useDidMountEffect } from 'hooks/useDidMountEffect';
import { useStateContext } from 'hooks/useStateContext';
import { CalendarDto, MonthDto } from 'modules/Home/types/event';
import { useRef, useState } from 'react';

const COLUMNS_AMOUNT = 7;
const ROWS_AMOUNT = 5;
const TOTAL_CELLS = COLUMNS_AMOUNT * ROWS_AMOUNT;

type CalendarProps = { data: CalendarDto | undefined; refetch: () => void };
type MonthProps = {
    month: dayjs.Dayjs;
    data: MonthDto | undefined;
    refetch: () => void;
};
type TooltipProps = {
    date: string;
    data: { avgRating: number; eventsCount: number; avgDuration: number } | undefined;
};

const TooltipContent = ({ date, data }: TooltipProps) => (
    <>
        <div className="text-center">{date}</div>
        {data && (
            <>
                <div className="text-base">Average rating: {data.avgRating.toFixed(2)}</div>
                <div className="text-base">Average duration: {data.avgDuration.toFixed(2)}</div>
                <div className="text-base">Faps count: {data.eventsCount}</div>
            </>
        )}
    </>
);

const Month = ({ data, month, refetch }: MonthProps) => {
    const { open } = useStateContext();

    const mappedEvents = new Map(
        data?.events.map(({ date, avgRating, eventsCount, avgDuration }) => [
            date,
            { avgRating, eventsCount, avgDuration },
        ])
    );

    return (
        <>
            <span className="font-semibold uppercase text-xl">{month.format('MMM')}</span>
            <div className="grid grid-cols-[repeat(7,_max-content)] gap-1">
                {Array.from({ length: month.daysInMonth() }).map((_, i) => {
                    const date = month.set('date', i + 1).format(DateFormats.Date);
                    const eventsForDate = mappedEvents.get(date);

                    return (
                        <Tooltip key={i} content={<TooltipContent date={date} data={eventsForDate} />}>
                            <div
                                onClick={() => open(DialogNames.CreateEvent, { date, onSubmit: refetch })}
                                className={`w-5 h-5 bg-primary rounded cursor-pointer ${
                                    eventsForDate && 'bg-secondary'
                                }`}
                                key={date}
                            />
                        </Tooltip>
                    );
                })}
                {Array.from({ length: TOTAL_CELLS - month.daysInMonth() }).map((_, i) => (
                    <div className="w-5 h-5 bg-gray-300 rounded cursor-not-allowed" key={`disabled-cell-${i}`} />
                ))}
            </div>
        </>
    );
};

const Calendar = ({ data, refetch }: CalendarProps) => {
    const [year] = useState(getCurrentYear);
    const ref = useRef<HTMLElement | null>(null);

    useDidMountEffect(() => {
        if (!ref.current) return;

        const cellWidth = 20;
        const sectionWidth = 164;
        const gapWidth = 4;
        const monthIndex = dayjs().get('month') - 1;

        ref.current.scrollLeft = (sectionWidth + gapWidth) * monthIndex + (2 * cellWidth + gapWidth);
    });

    return (
        <section ref={ref} className="flex gap-1 overflow-x-auto pb-2">
            {getMonthsArray().map((monthNumber) => {
                const month = dayjs(`${year}-${monthNumber}`);
                const formattedMonth = month.format(DateFormats.Month);

                return (
                    <div key={formattedMonth} id={formattedMonth}>
                        <Month
                            data={data && data.find(({ _id }) => formattedMonth === _id)}
                            month={month}
                            refetch={refetch}
                        />
                    </div>
                );
            })}
        </section>
    );
};

export default Calendar;
