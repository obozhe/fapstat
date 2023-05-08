import { OmitType } from '@nestjs/mapped-types';

import { User } from '@m/user/schemas/user.schema';

export class UserDTO extends OmitType(User, ['password', 'verified'] as const) {
    id: string;
    createdAt: string;
}
