import { AxiosRequestConfig } from 'axios';
import axios from 'core/axios';

import { StatsDto } from '../types/stats';

export enum StatsUrl {
    getStats = '/stats',
}

export default abstract class StatsApi {
    public static getStats(month: string, config?: AxiosRequestConfig) {
        return axios.get<StatsDto, StatsDto>(StatsUrl.getStats, { params: { month }, ...config });
    }
}
