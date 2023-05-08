import { AchievementsCodes } from '../enums/achievements-codes';

export const achievements: Record<AchievementsCodes, { code: AchievementsCodes; label: string; description: string }> =
    {
        [AchievementsCodes.WELCOME]: {
            code: AchievementsCodes.WELCOME,
            label: 'WELCUM',
            description: 'We are happy to see you with us',
        },
        [AchievementsCodes.ROOKIE]: {
            code: AchievementsCodes.ROOKIE,
            label: 'ROOKIE',
            description: 'Completed first session',
        },
        [AchievementsCodes.ENDURANCE_TRAINING]: {
            code: AchievementsCodes.ENDURANCE_TRAINING,
            label: 'ENDURANCE TRAINING',
            description: 'Completed 5 sessions in a day',
        },
        [AchievementsCodes.CONSISTENT]: {
            code: AchievementsCodes.CONSISTENT,
            label: 'CONSISTENT',
            description: 'Completed 30 sessions in a month',
        },
        [AchievementsCodes.BESTIE]: {
            code: AchievementsCodes.BESTIE,
            label: 'BESTIE',
            description: 'Completed a session with a friend',
        },
        [AchievementsCodes.VIRTUOSO]: {
            code: AchievementsCodes.VIRTUOSO,
            label: 'VIRTUOSO',
            description: 'Completed a session lasting longer than 20 minutes',
        },
        [AchievementsCodes.ADVENTUROUS]: {
            code: AchievementsCodes.ADVENTUROUS,
            label: 'ADVENTUROUS',
            description: 'Tried all major categories',
        },
        [AchievementsCodes.RELIABLE]: {
            code: AchievementsCodes.RELIABLE,
            label: 'RELIABLE',
            description: 'Completed a session every day for a week',
        },
        [AchievementsCodes.EARLY_RISER]: {
            code: AchievementsCodes.EARLY_RISER,
            label: 'EARLY RISER',
            description: 'Completed a session in the morning',
        },
        [AchievementsCodes.RELAXED]: {
            code: AchievementsCodes.RELAXED,
            label: 'RELAXED',
            description: 'Completed a session before bedtime',
        },
        [AchievementsCodes.FANATIC]: {
            code: AchievementsCodes.FANATIC,
            label: 'FANATIC',
            description: 'Completed 100 sessions in a month',
        },
        [AchievementsCodes.SEX_GIANT]: {
            code: AchievementsCodes.SEX_GIANT,
            label: 'SEX GIANT',
            description: 'Completed 500+ sessions in the app',
        },
        [AchievementsCodes.CREATIVE]: {
            code: AchievementsCodes.CREATIVE,
            label: 'CREATIVE',
            description: 'Invented a new category',
        },
        [AchievementsCodes.EXPLORER]: {
            code: AchievementsCodes.EXPLORER,
            label: 'EXPLORER',
            description: 'Tried a new location for a session',
        },
        [AchievementsCodes.IMPRESSIVE_STAMINA]: {
            code: AchievementsCodes.IMPRESSIVE_STAMINA,
            label: 'IMPRESSIVE STAMINA',
            description: 'Completed 10 sessions in one day',
        },
    };
