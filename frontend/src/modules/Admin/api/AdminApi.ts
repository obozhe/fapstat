import { AxiosRequestConfig } from 'axios';
import axios from 'core/axios';
import { TableData, TableOptionsDto } from 'core/types/ui';
import { UserDto } from 'core/types/userDto';

export enum AdminURL {
    getUsers = '/admin/users',
    deleteUsers = '/admin/users/delete',
    ban = '/admin/users/ban',
    unBan = '/admin/users/unban',
}

export default abstract class AdminApi {
    public static getUsers(options: TableOptionsDto, config: AxiosRequestConfig): Promise<TableData<UserDto>> {
        return axios.post<void, TableData<UserDto>, TableOptionsDto>(AdminURL.getUsers, options, config);
    }

    public static deleteUsers(body: { ids: string[] }, config: AxiosRequestConfig): Promise<void> {
        return axios.delete<void, void, { ids: string[] }>(AdminURL.deleteUsers, { ...config, data: body });
    }

    public static ban(body: { ids: string[] }, config: AxiosRequestConfig): Promise<void> {
        return axios.patch<void, void, { ids: string[] }>(AdminURL.ban, body, config);
    }

    public static unBan(body: { ids: string[] }, config: AxiosRequestConfig): Promise<void> {
        return axios.patch<void, void, { ids: string[] }>(AdminURL.unBan, body, config);
    }
}
