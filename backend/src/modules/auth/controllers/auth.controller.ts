import { Body, Controller, Get, HttpException, HttpStatus, Patch, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';
import { Cookie, CookieActions } from 'core/decorators/cookie.decorator';

import { AchievementsService } from '@m/achievements/services/achievements.service';
import { UserDTO } from '@m/user/models/user-dto';
import { UserService } from '@m/user/services/user.service';
import { VerificationService } from '@m/verification/services/verification.service';

import { CreateUserDTO } from '../models/create-user-dto';
import { LoginUserDTO } from '../models/login-user-dto';
import { UpdatePasswordDTO } from '../models/update-password-dto';

@ApiTags('auth')
@Controller('/api/auth')
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly verificationService: VerificationService,
        private readonly jwtService: JwtService,
        private readonly achievementsService: AchievementsService
    ) {}

    @Post('/login')
    public async login(@Cookie('jwt') cookie: CookieActions, @Body() userDto: LoginUserDTO) {
        const user = await this.userService.find({
            $or: [{ username: userDto.username }, { email: userDto.username }],
        });

        await this.userService.checkBanList(user._id);

        if (!user.verified) {
            throw new HttpException('Email is not verified', HttpStatus.FORBIDDEN);
        }

        const isPasswordValid = user.validatePassword(userDto.password);
        if (!isPasswordValid) {
            throw new HttpException('Wrong email or password', HttpStatus.BAD_REQUEST);
        }

        const updatedUser = await this.userService.update(user._id, {
            lastLogin: new Date(Date.now()),
            timezone: userDto.timezone,
        });

        const userDTO = updatedUser.toJSON() as UserDTO;
        const jwt: string = this.jwtService.sign(userDTO);

        cookie.set(jwt);
        return userDTO;
    }

    @Post('/create')
    public async register(@Body() userDto: CreateUserDTO) {
        const existingUser = await this.userService.findSoft({ email: userDto.email });
        if (existingUser) {
            await this.userService.checkBanList(existingUser._id);

            if (existingUser.verified) {
                throw new HttpException('User already exists', HttpStatus.CONFLICT);
            } else {
                await existingUser.delete();
            }
        }

        const user = await this.userService.create(userDto);
        return user._id;
    }

    @Patch('/verify')
    public async verify(@Cookie('jwt') cookie: CookieActions, @Body() body: { userId: string; code: string }) {
        const user = await this.userService.findById(body.userId);

        if (user.verified) {
            throw new HttpException('User is already verified', HttpStatus.CONFLICT);
        }

        await this.verificationService.verify(user._id, body.code);
        const updatedUser = await this.userService.update(user._id, {
            verified: true,
            lastLogin: new Date(Date.now()),
        });

        const userDTO = updatedUser.toJSON() as UserDTO;
        const jwt: string = this.jwtService.sign(userDTO);

        await this.achievementsService.initUser(updatedUser._id);

        cookie.set(jwt);
        return userDTO;
    }

    @Patch('/update-password')
    public async updatePassword(@Cookie('jwt') cookie: CookieActions, @Body() body: UpdatePasswordDTO) {
        const user = await this.userService.findById(body.userId);

        await this.verificationService.verify(user._id, body.code);

        user.password = body.password;
        await user.save();

        const userDTO = user.toJSON() as UserDTO;
        const jwt: string = this.jwtService.sign(userDTO);

        cookie.set(jwt);
        return userDTO;
    }

    @Get('/logout')
    public async logout(@Cookie('jwt') cookie: CookieActions) {
        cookie.clear();
        return;
    }
}
