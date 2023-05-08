import { AxiosRequestConfig } from 'axios';
import axios from 'core/axios';
import { UserDto } from 'core/types/userDto';

import { SignUpFormData } from './../../modules/Auth/types/SignUpFormData';

export enum UsersURL {
    signOut = '/auth/logout',
    getVerificationCode = '/verification/code',
    getUserId = '/users/id',
    isUsernameFree = '/users/username/check',
    fetchUser = '/users/me',
    update = '/users/me/update',
    updatePassword = '/users/me/update/password',
}

export default abstract class UsersApi {
    public static getUserIdByEmail(email: string, config: AxiosRequestConfig) {
        return axios.get<void, string>(UsersURL.getUserId, { ...config, params: { email } });
    }

    public static isUsernameFree(username: string, config?: AxiosRequestConfig) {
        return axios.get<void, boolean>(UsersURL.isUsernameFree, { ...config, params: { username } });
    }

    public static fetchUser(config: AxiosRequestConfig) {
        return axios.get<void, UserDto | null>(UsersURL.fetchUser, config);
    }

    public static getVerificationCode(userId: string, config: AxiosRequestConfig) {
        return axios.get<void, void>(UsersURL.getVerificationCode, { ...config, params: { userId } });
    }

    public static signOut() {
        return axios.get(UsersURL.signOut);
    }

    public static update(updatedData: Partial<SignUpFormData>, config: AxiosRequestConfig): Promise<UserDto> {
        return axios.patch(UsersURL.update, updatedData, config);
    }

    public static updatePassword(
        body: { code: string; password: string },
        config: AxiosRequestConfig
    ): Promise<UserDto> {
        return axios.patch(UsersURL.updatePassword, body, config);
    }
}
