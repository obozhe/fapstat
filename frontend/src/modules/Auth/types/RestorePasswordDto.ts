import { AuthenticationProps } from './enums';

export interface RestorePasswordDto {
    userId: string;
    code: string;
    [AuthenticationProps.Password]: string;
}
