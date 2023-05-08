import Loader from '@ui/Loader';
import Tooltip from '@ui/Tooltip';
import clsx from 'clsx';
import { AchievementsCodes } from 'core/enums/Achievements';
import AchievementsApi, { AchievementsUrl } from 'core/services/AchievementApi';
import useFetch from 'hooks/useFetch';

const Achievement = () => {
    const { data: achievements, isLoading } = useFetch(AchievementsUrl.allAchievements, (config) =>
        AchievementsApi.getAchievements(config)
    );

    if (isLoading) {
        return (
            <div className="relative h-full">
                <Loader />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 auto-rows-[minmax(100px,1fr)]">
            {achievements?.map((achievement) => {
                return (
                    <Tooltip content={achievement.description}>
                        <div
                            className={clsx(
                                'h-full rounded-md flex justify-center text-center items-center bg-black text-white',
                                achievement.code !== AchievementsCodes.UNRECEIVED && 'bg-secondary'
                            )}
                        >
                            {achievement.label}
                        </div>
                    </Tooltip>
                );
            })}
        </div>
    );
};

export default Achievement;
