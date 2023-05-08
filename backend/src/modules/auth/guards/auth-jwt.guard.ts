import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserDTO } from '@m/user/models/user-dto';

@Injectable()
export class AuthJWTGuard extends AuthGuard('jwt') {
    handleRequest<TUser = UserDTO>(err: any, user: TUser | false, info: any, context: ExecutionContext): TUser {
        const isGetUserRequest = context.switchToHttp().getRequest().originalUrl.includes('/api/users/me');

        if (isGetUserRequest && !user) {
            return null;
        }

        if (err || !user) {
            throw err || new ForbiddenException();
        }

        return user;
    }
}
