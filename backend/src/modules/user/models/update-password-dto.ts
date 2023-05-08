import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

import { LoginUserDTO } from '@m/auth/models/login-user-dto';

export class UpdatePasswordDTO extends PickType(LoginUserDTO, ['password'] as const) {
    @ApiProperty()
    @Length(6)
    code: string;
}
