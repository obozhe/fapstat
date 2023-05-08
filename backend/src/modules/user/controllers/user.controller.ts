import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CheckUsernameDTO } from '../models/check-username-dto';
import { GetUserIdDTO } from '../models/get-userid-dto';
import { UserService } from './../services/user.service';

@ApiTags('users')
@Controller('/api/users')
export class UserController {
    constructor(private readonly userService: UserService) {
        userService.createMocks();
    }

    @Get('/id')
    public async getUserIdByEmail(@Query() { email }: GetUserIdDTO) {
        const user = await this.userService.find({ email });

        return user._id;
    }

    @Get('/username/check')
    public async isUsernameFree(@Query() { username }: CheckUsernameDTO) {
        const user = await this.userService.findSoft({ username });
        return !user;
    }
}
