import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { CategoryCollectionService } from './category-collection.service';

@Injectable()
export class CategoryService {
    constructor(private categoryCollection: CategoryCollectionService) {}

    public async getValueById(category: string | Types.ObjectId): Promise<string> {
        const { value } = await this.categoryCollection.findById(category);
        return value;
    }

    public async getCategoriesCountByUser(user: string): Promise<number> {
        const userCategories = await this.categoryCollection.findByUser(user);
        return userCategories.length;
    }

    public async getGeneralCategoriesIds(): Promise<string[]> {
        const generalCategories = await this.categoryCollection.getGeneralCategories();
        return generalCategories.map(({ _id }) => String(_id));
    }
}
