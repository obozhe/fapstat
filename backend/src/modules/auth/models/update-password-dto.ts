import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Length, Matches } from 'class-validator';

import { LoginUserDTO } from './login-user-dto';

export class UpdatePasswordDTO extends PickType(LoginUserDTO, ['password'] as const) {
    @ApiProperty()
    @Matches(/^[a-f\d]{24}$/i)
    userId: string;

    @ApiProperty()
    @Length(6)
    code: string;
}
