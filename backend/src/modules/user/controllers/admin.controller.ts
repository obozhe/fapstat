import { Body, Controller, Delete, HttpCode, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

import { Roles } from '@m/auth/decorators/roles.decorator';
import { AuthJWTGuard } from '@m/auth/guards/auth-jwt.guard';
import { UserRoles } from '@m/user/enums/user-roles.enum';

import { AdminTableOptionsDTO } from '../models/admin-table-options-dto';
import { BannedUserCollectionService } from '../services/banned-user-collection.service';
import { UserCollectionService } from '../services/user-collection.service';

@ApiTags('admin')
@ApiCookieAuth()
@UseGuards(AuthJWTGuard)
@Roles(UserRoles.Admin)
@Controller('/api/admin/users')
export class AdminController {
    constructor(
        private readonly userCollection: UserCollectionService,
        private readonly bannedUserCollection: BannedUserCollectionService
    ) {}

    @Post('/')
    @HttpCode(200)
    public async getUsersTableData(@Body() tableOptionsDto: AdminTableOptionsDTO) {
        const usersCount = await this.userCollection.getUsersCount();
        const bannedUsersCount = await this.bannedUserCollection.getBannedUsersCount();

        const total = tableOptionsDto.filters.banned ? bannedUsersCount : usersCount - bannedUsersCount;

        const rows = await this.userCollection.getAdminTableUsers(tableOptionsDto);

        return { total, rows };
    }

    @Delete('/delete')
    public async delete(@Body() { ids }: { ids: string[] }) {
        return await this.userCollection.deleteMany(ids);
    }

    @Patch('/ban')
    public async ban(@Body() { ids }: { ids: string[] }) {
        return await this.bannedUserCollection.create(ids);
    }

    @Patch('/unban')
    public async unBan(@Body() { ids }: { ids: string[] }) {
        return await this.bannedUserCollection.deleteMany(ids);
    }
}
