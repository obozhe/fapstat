import CountUp from '@components/CountUp';
import Button from '@ui/Button';
import Loader from '@ui/Loader';
import Tooltip from '@ui/Tooltip';
import { DateFormats } from 'core/enums/DateFormats';
import AchievementsApi, { AchievementsUrl } from 'core/services/AchievementApi';
import { AchievementDto } from 'core/types/AchievementDto';
import dayjs from 'dayjs';
import { greetingTime } from 'helpers/date';
import useAuth from 'hooks/useAuth';
import useFetch from 'hooks/useFetch';
import { useStateContext } from 'hooks/useStateContext';
import { Award, Grip, Lock } from 'lucide-react';
import Calendar from 'modules/Home/components/Calendar';
import { CalendarDto } from 'modules/Home/types/event';
import { StatsDto } from 'modules/Home/types/stats';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import EventsApi, { EventsURL } from '../api/EventsApi';
import StatsApi, { StatsUrl } from '../api/StatsApi';
import DurationChart from '../components/DurationChart/DurationChart';
import MenuBlock from '../components/MenuBlock';
import MonthChart from '../components/MonthChart/MonthChart';
import { formatPerDayStats } from '../helpers/format-per-day-stats';

const currentMonth = dayjs().format(DateFormats.Month);
const currentYear = dayjs().format(DateFormats.Year);

const HomePage = () => {
    const { updateAchievementUnlock } = useStateContext();

    const {
        data: stats,
        isValidating: areStatsLoading,
        mutate: reloadStats,
    } = useFetch<StatsDto>([StatsUrl.getStats, currentMonth], (config) => StatsApi.getStats(currentMonth, config));
    const {
        data: calendarEvents,
        isValidating: isCalendarLoading,
        mutate: reloadCalendar,
    } = useFetch<CalendarDto>([EventsURL.getCalendar, currentYear], (config) =>
        EventsApi.getCalendar(currentYear, config)
    );

    const { mutate: reloadAchievements } = useFetch<AchievementDto[]>(
        AchievementsUrl.newAchievements,
        (config) => AchievementsApi.getNewAchievements(config),
        {
            onSuccess: (newAchievements) => {
                if (!newAchievements.length) return;

                updateAchievementUnlock(newAchievements);
            },
        }
    );
    const { data: lastAchievements, mutate: reloadLastAchievements } = useFetch<AchievementDto[]>(
        AchievementsUrl.lastAchievements,
        (config) => AchievementsApi.getLastAchievements(config)
    );

    const perDayStats = useMemo(() => formatPerDayStats(stats?.perDayStats, currentMonth), [stats]);

    const refetchData = () => {
        reloadCalendar();
        reloadStats();
        reloadAchievements();
        reloadLastAchievements();
    };

    const { user } = useAuth();

    if (areStatsLoading || isCalendarLoading || !stats) return <Loader />;

    return (
        <main>
            <div className="mt-[30px] mb-8">
                <h1 className="mb-2 uppercase">
                    Good {greetingTime()}, {user?.firstName}.
                </h1>
                <h3 className="uppercase">How is your day so far?</h3>
            </div>

            <div className="grid sm:grid-cols-[358px,_1fr] grid-cols-1 gap-20">
                <MenuBlock refetch={refetchData} />

                <div className="grid sm:grid-cols-[175px,_1fr] gap-20">
                    <div className="flex flex-col gap-2">
                        <h3 className="uppercase">Achievements</h3>
                        <div className="h-full grid grid-cols-6 sm:grid-cols-3 gap-2">
                            {lastAchievements?.map((achievement, i) => (
                                <Tooltip
                                    key={achievement.code}
                                    content={<div>{lastAchievements[lastAchievements.length - 1 - i].label}</div>}
                                >
                                    <div className="aspect-square h-full w-full sm:w-[53px] sm:h-[53px] bg-primary rounded flex items-center justify-center">
                                        <Award className="text-bg-main" />
                                    </div>
                                </Tooltip>
                            ))}
                            {(lastAchievements?.length || 0) < 5 &&
                                Array.from({ length: 5 - (lastAchievements?.length || 0) }, (_, i) => (
                                    <Tooltip key={i} content={<div>NOT RECEIVED</div>}>
                                        <div className="aspect-square h-full w-full sm:w-[53px] sm:h-[53px] bg-primary rounded flex items-center justify-center">
                                            <Lock className="text-bg-main" />
                                        </div>
                                    </Tooltip>
                                ))}
                            <Tooltip content="View All Achievements">
                                <Link to="/my/achievements">
                                    <Button className="aspect-square !h-full !w-full sm:!w-[53px] sm:!h-[53px] !bg-primary rounded flex items-center justify-center">
                                        <Grip className="text-bg-main" />
                                    </Button>
                                </Link>
                            </Tooltip>
                        </div>
                    </div>

                    <div className="relative">
                        <h3 className="absolute uppercase whitespace-nowrap text-sm sm:text-lg top-[2px] sm:top-0">
                            faps count per day
                        </h3>
                        <MonthChart data={perDayStats.eventsCounts} />
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <Calendar data={calendarEvents} refetch={refetchData} />
                </div>

                <div className="flex flex-col gap-2 w-fit">
                    <h2 className="uppercase">{dayjs().format('MMMM')} records</h2>
                    <div className="grid grid-cols-2 gap-2">
                        {stats.records.map(({ label, value }, index) => (
                            <div
                                key={`${label}-${index}`}
                                className="bg-primary rounded aspect-square w-full h-full sm:w-[175px] sm:h-[175px] text-bg-main p-4"
                            >
                                <CountUp className="text-5xl" value={value} />
                                <div className="uppercase line-clamp-4 w-10/12">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="uppercase">Average stats for {dayjs().format('MMMM')}</h2>
                    <div className="grid gap-2 h-full grid-rows-[175px_1fr]">
                        <div className="grid grid-cols-2 sm:grid-cols-4">
                            {stats.averageStats.map(({ label, value }, index) => (
                                <div key={`${label}-${index}`}>
                                    <div className="uppercase">{label}</div>
                                    <CountUp className="text-5xl" value={Math.round((value as number) * 1000) / 1000} />
                                </div>
                            ))}
                        </div>

                        <div className="flex-1 mt-4 sm:mt-0 relative">
                            <h3 className="absolute uppercase whitespace-nowrap text-sm sm:text-lg top-[2px] sm:top-0">
                                faps duration per day
                            </h3>
                            <DurationChart data={perDayStats.durationsSums} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default HomePage;
