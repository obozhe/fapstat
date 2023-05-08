import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

import { User } from '@m/auth/decorators/user.decorator';
import { AuthJWTGuard } from '@m/auth/guards/auth-jwt.guard';
import { VerificationService } from '@m/verification/services/verification.service';

import { UpdateUserDTO } from '../models/update-user-dto';
import { UserDTO } from '../models/user-dto';
import { UpdatePasswordDTO } from './../models/update-password-dto';
import { UserService } from './../services/user.service';

@ApiTags('users')
@ApiCookieAuth()
@UseGuards(AuthJWTGuard)
@Controller('/api/users/me')
export class MeController {
    constructor(private readonly userService: UserService, private readonly verificationService: VerificationService) {}

    @Get()
    public getCurrent(@User() user: UserDTO) {
        return user;
    }

    @Patch('/update')
    public async update(@Body() updatedData: UpdateUserDTO, @User() user: UserDTO) {
        const updatedUser = await this.userService.update(user.id, updatedData);

        return updatedUser;
    }

    @Patch('/update/password')
    public async updatePassword(@Body() { password, code }: UpdatePasswordDTO, @User() { id }: UserDTO) {
        this.verificationService.verify(id, code);

        const user = await this.userService.findById(id);

        user.password = password;
        await user.save();

        return user;
    }
}
