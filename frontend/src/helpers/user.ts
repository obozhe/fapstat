import { UserRoles } from 'core/enums/UserRoles';
import { UserDto } from 'core/types/userDto';

export const isAdmin = (user: UserDto | null): boolean => user?.role === UserRoles.Admin;

export const fullName = (user: UserDto | null): string => (user ? user.firstName + ' ' + user.lastName : '');
