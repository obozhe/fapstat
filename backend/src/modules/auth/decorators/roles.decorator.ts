import { SetMetadata } from '@nestjs/common';

import { UserRoles } from '@m/user/enums/user-roles.enum';

export const Roles = (...roles: UserRoles[]) => SetMetadata('roles', roles);
