import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import express from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserDTO } from '@m/user/models/user-dto';
import { UserService } from '@m/user/services/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: express.Request) => {
                    const jwt = request?.cookies['jwt'];
                    if (!jwt) {
                        return null;
                    }

                    return jwt;
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    public async validate(payload: UserDTO | null): Promise<UserDTO> {
        if (!payload) {
            throw new UnauthorizedException();
        }

        const user = await this.userService.findById(payload.id);
        await this.userService.checkBanList(user._id);

        return payload;
    }
}
