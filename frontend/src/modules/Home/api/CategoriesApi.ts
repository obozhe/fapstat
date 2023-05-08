import { AxiosRequestConfig } from 'axios';
import axios from 'core/axios';
import { CategoryDto } from 'core/types/categoryDto';
import { OptionDto } from 'core/types/optionsDto';

export enum CategoriesURL {
    getCombinedCategories = '/categories/combined',
    createCategory = '/categories',
    userCategories = '/categories/my',
    deleteCategory = '/categories/my',
}

export default abstract class CategoriesApi {
    public static createCategory(body: { value: string }, config: AxiosRequestConfig) {
        return axios.post<OptionDto, OptionDto>(CategoriesURL.createCategory, body, config);
    }

    public static getCombinedCategories(config: AxiosRequestConfig) {
        return axios.get<OptionDto[], OptionDto[]>(CategoriesURL.getCombinedCategories, config);
    }

    public static getUserCategories(config: AxiosRequestConfig) {
        return axios.get<CategoryDto[], CategoryDto[]>(CategoriesURL.userCategories, config);
    }

    public static deleteUserCategories(body: { ids: string[] }, config: AxiosRequestConfig) {
        return axios.delete<void, void, { ids: string[] }>(CategoriesURL.userCategories, { data: body, ...config });
    }
}
