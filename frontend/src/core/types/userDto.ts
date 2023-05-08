import { UserRoles } from 'core/enums/UserRoles';

export interface UserDto {
    email: string;
    firstName: string;
    id: string;
    lastName: string;
    role: UserRoles;
    lastLogin: string;
    createdAt: string;
    avatar: { emoji: string; color: string };
    timezone: string;
    username: string;
}
