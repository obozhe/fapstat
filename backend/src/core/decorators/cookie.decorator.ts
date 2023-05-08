import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export type CookieActions = { set: (value: string) => void; clear: () => void };

export const Cookie = createParamDecorator((key: string, ctx: ExecutionContext): CookieActions => {
    const response = ctx.switchToHttp().getResponse();
    return {
        set: (value: string) => response.cookie(key, value, { httpOnly: true, secure: true }),
        clear: () => response.clearCookie(key),
    };
});
