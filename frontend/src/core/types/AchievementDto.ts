import { AchievementsCodes } from 'core/enums/Achievements';

export interface AchievementDto {
    code: AchievementsCodes;
    label: string;
    description: string;
    receivedDate: string;
}
