import { AchievementsCodes } from '@m/achievements/enums/achievements-codes';

export interface AchievementDTO {
    code: AchievementsCodes;
    label: string;
    description: string;
}
