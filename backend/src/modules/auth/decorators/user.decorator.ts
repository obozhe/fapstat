import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { UserDTO } from '@m/user/models/user-dto';

export const User = createParamDecorator((_: unknown, ctx: ExecutionContext): UserDTO | null => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});
