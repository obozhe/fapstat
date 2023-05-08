import { PartialType, PickType } from '@nestjs/mapped-types';

import { CreateUserDTO } from '@m/auth/models/create-user-dto';

const fields = ['firstName', 'lastName', 'timezone', 'avatar', 'username'] as const;

export class UpdateUserDTO extends PartialType(PickType(CreateUserDTO, fields)) {
    lastLogin?: Date;
    verified?: boolean;
}
