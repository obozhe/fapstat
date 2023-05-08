import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LeanDocument, Model, Types } from 'mongoose';

import { generalCategories } from '../consts/general-categories.const';
import { Category, CategoryDocument } from '../schemas/category.schema';

@Injectable()
export class CategoryCollectionService {
    constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {
        // this.createGeneralCategories();
    }

    public async createGeneralCategories(): Promise<CategoryDocument[]> {
        return await this.categoryModel.create(generalCategories.map((category) => ({ value: category, user: null })));
    }

    public async create(userId: string, category: { value: string }): Promise<CategoryDocument> {
        return await this.categoryModel.create({ user: new Types.ObjectId(userId), value: category.value });
    }

    public async findById(id: string | Types.ObjectId): Promise<CategoryDocument> {
        return await this.categoryModel.findById(id);
    }

    public async findByUser(userId: string): Promise<CategoryDocument[]> {
        const user = new Types.ObjectId(userId);
        return await this.categoryModel.find({ user });
    }

    public async getCombined(userId: string): Promise<CategoryDocument[]> {
        const user = new Types.ObjectId(userId);
        return await this.categoryModel.find({ $or: [{ user }, { user: null }] }).sort({ value: 1 });
    }

    public async findByIds(ids: string[]): Promise<LeanDocument<CategoryDocument>[]> {
        return await this.categoryModel.find({ _id: { $in: ids } }).lean();
    }

    public async deleteMany(ids: string[]) {
        return await this.categoryModel.deleteMany({ _id: { $in: ids } }).lean();
    }

    public async getGeneralCategories(): Promise<CategoryDocument[]> {
        return await this.categoryModel.find({ user: null });
    }
}
