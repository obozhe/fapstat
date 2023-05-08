import { AxiosRequestConfig } from 'axios';
import axios from 'core/axios';
import { AchievementDto } from 'core/types/AchievementDto';

export enum AchievementsUrl {
    allAchievements = '/achievements',
    newAchievements = '/achievements/new',
    lastAchievements = '/achievements/last',
    clearAchievements = '/achievements/new/clear',
}

export default abstract class AchievementsApi {
    public static getAchievements(config: AxiosRequestConfig) {
        return axios.get<void, AchievementDto[]>(AchievementsUrl.allAchievements, config);
    }

    public static getNewAchievements(config: AxiosRequestConfig) {
        return axios.get<void, AchievementDto[]>(AchievementsUrl.newAchievements, config);
    }

    public static getLastAchievements(config: AxiosRequestConfig) {
        return axios.get<void, AchievementDto[]>(AchievementsUrl.lastAchievements, config);
    }

    public static clearAchievements(config: AxiosRequestConfig) {
        return axios.patch<void, void>(AchievementsUrl.clearAchievements, config);
    }
}
