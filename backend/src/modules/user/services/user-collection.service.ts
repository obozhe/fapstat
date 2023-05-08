import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { randomUUID } from 'node:crypto';

import { CreateUserDTO } from '../../auth/models/create-user-dto';
import { AdminTableOptionsDTO } from '../models/admin-table-options-dto';
import { UpdateUserDTO } from '../models/update-user-dto';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserCollectionService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

    public async create(user: CreateUserDTO): Promise<UserDocument> {
        return await this.userModel.create(user);
    }

    public async update(user: Types.ObjectId, updatedData: UpdateUserDTO): Promise<UserDocument> {
        return await this.userModel.findOneAndUpdate(user, updatedData, { runValidators: true, new: true });
    }

    public async findById(user: Types.ObjectId): Promise<UserDocument> {
        return await this.userModel.findById(user);
    }

    public async findOne(filter: FilterQuery<UserDocument>): Promise<UserDocument> {
        return await this.userModel.findOne(filter);
    }

    public async updateLastLogin(userId: Types.ObjectId): Promise<UserDocument> {
        return await this.userModel.findByIdAndUpdate(userId, { lastLogin: new Date(Date.now()) });
    }

    public async verify(userId: Types.ObjectId): Promise<UserDocument> {
        return await this.userModel.findByIdAndUpdate(userId, { verified: true });
    }

    public async deleteMany(ids: string[]) {
        return await this.userModel.deleteMany({ _id: { $in: ids } });
    }

    public async getAdminTableUsers(tableOptionsDto: AdminTableOptionsDTO) {
        const { filters, page, pageSize } = tableOptionsDto;
        return await this.userModel
            .aggregate()
            .lookup({
                from: 'bannedusers',
                as: 'bannedList',
                localField: '_id',
                foreignField: 'user',
            })
            .project({
                _id: 0,
                id: '$_id',
                username: 1,
                firstName: 1,
                lastName: 1,
                email: 1,
                role: 1,
                lastLogin: 1,
                createdAt: 1,
                isBanned: { $convert: { input: { $size: '$bannedList' }, to: 'bool' } },
            })
            .match({ isBanned: filters.banned })
            .skip(page * pageSize)
            .limit(pageSize);
    }

    public async getUsersCount(): Promise<number> {
        return await this.userModel.count();
    }

    public async createMocks() {
        this.userModel.create({
            username: 'admin',
            firstName: 'Fap',
            lastName: 'Master',
            role: 'Admin',
            email: 'admin@g.com',
            password: 'password1',
            verified: true,
            timezone: 'Europe/Moscow',
            avatar: { emoji: '1f423', color: '#FFC0CB' },
        });

        const users = Array.from({ length: 100 }, (v, i) => {
            const uuid = randomUUID();
            return {
                firstName: 'Ubludok',
                lastName: 'Nomer_' + i,
                role: 'Basic',
                username: uuid,
                email: uuid + '@g.com',
                password: 'password1',
                timezone: 'Europe/Moscow',
                verified: true,
                avatar: { emoji: '1f423', color: Math.floor(Math.random() * 16777215).toString(16) },
            };
        });

        await this.userModel.create(users);
    }
}
