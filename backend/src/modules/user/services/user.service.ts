import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';

import { CreateUserDTO } from '@m/auth/models/create-user-dto';
import { UserDocument } from '@m/user/schemas/user.schema';

import { UpdateUserDTO } from '../models/update-user-dto';
import { BannedUserCollectionService } from './banned-user-collection.service';
import { UserCollectionService } from './user-collection.service';

@Injectable()
export class UserService {
    constructor(
        private readonly userCollection: UserCollectionService,
        private readonly bannedCollection: BannedUserCollectionService
    ) {}

    public createMocks() {
        // this.userCollection.createMocks();
    }

    public async create(user: CreateUserDTO): Promise<UserDocument> {
        return await this.userCollection.create(user);
    }

    public async update(userId: string | Types.ObjectId, updatedData: UpdateUserDTO): Promise<UserDocument> {
        const id = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;
        const user = await this.userCollection.update(id, updatedData);

        if (!user) {
            throw new NotFoundException('User is not found');
        }

        return user;
    }

    public async findById(userId: string | Types.ObjectId): Promise<UserDocument> {
        const id = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;
        const user = await this.userCollection.findById(id);

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }

    public async find(filter: FilterQuery<UserDocument>): Promise<UserDocument> {
        const user = await this.userCollection.findOne(filter);

        if (!user) {
            throw new NotFoundException('User is not found');
        }

        return user;
    }

    public async findSoft(filter: FilterQuery<UserDocument>): Promise<UserDocument | null> {
        return await this.userCollection.findOne(filter);
    }

    public async checkBanList(userId: Types.ObjectId): Promise<void> {
        const isBanned = await this.bannedCollection.isUserBanned(userId);

        if (isBanned) {
            throw new ForbiddenException('User is banned');
        }
    }

    public async verify(userId: Types.ObjectId): Promise<void> {
        const isBanned = await this.bannedCollection.isUserBanned(userId);

        if (isBanned) {
            throw new ForbiddenException('User is banned');
        }
    }
}
