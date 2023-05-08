import { AxiosRequestConfig } from 'axios';
import axios from 'core/axios';
import { UserDto } from 'core/types/userDto';

import { RestorePasswordDto } from '../types/RestorePasswordDto';
import { SignInFormData } from '../types/SignInFormData';
import { SignUpFormData } from '../types/SignUpFormData';

export enum AuthURL {
    signIn = '/auth/login',
    signUp = '/auth/create',
    verify = '/auth/verify',
    restorePassword = '/auth/restore-password',
    updatePassword = '/auth/update-password',
}

export default abstract class AuthApi {
    public static signIn(formData: SignInFormData, config: AxiosRequestConfig) {
        return axios.post<void, UserDto>(AuthURL.signIn, formData, config);
    }

    public static signUp(formData: SignUpFormData, config: AxiosRequestConfig) {
        return axios.post<void, string>(AuthURL.signUp, formData, config);
    }

    public static verify(body: { userId: string; code: string }, config: AxiosRequestConfig) {
        return axios.patch<void, UserDto>(AuthURL.verify, body, config);
    }

    public static updatePassword(body: RestorePasswordDto, config: AxiosRequestConfig) {
        return axios.patch<void, UserDto>(AuthURL.updatePassword, body, config);
    }
}
