import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
    IsEmail,
    IsHexColor,
    IsNotEmpty,
    IsString,
    Matches,
    MaxLength,
    MinLength,
    ValidateNested,
} from 'class-validator';

import { LoginUserDTO } from './login-user-dto';

class Avatar {
    @ApiProperty()
    @Matches(/^([0-9a-f]{4,5}[-]?){1,8}$/)
    emoji: string;

    @ApiProperty()
    @IsHexColor()
    color: string;
}

export class CreateUserDTO extends LoginUserDTO {
    @ApiProperty()
    @IsEmail()
    @MaxLength(200)
    @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    @Transform(({ value }: { value: string }) => value.trim())
    lastName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    @Transform(({ value }: { value: string }) => value.trim())
    firstName: string;

    @ApiProperty()
    @MinLength(8)
    @MaxLength(200)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]?).+$/i)
    passwordConfirmation: string;

    @ApiProperty()
    @ValidateNested()
    @Type(() => Avatar)
    avatar: Avatar;
}
