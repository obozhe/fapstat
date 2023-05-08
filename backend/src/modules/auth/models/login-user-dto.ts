import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsTimeZone, Matches, MaxLength, MinLength } from 'class-validator';

export class LoginUserDTO {
    @ApiProperty()
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
    username: string;

    @ApiProperty()
    @MinLength(8)
    @MaxLength(200)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]?).+$/i)
    password: string;

    @ApiProperty()
    @IsTimeZone()
    timezone: string;
}
