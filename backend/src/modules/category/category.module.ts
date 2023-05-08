import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Category, CategorySchema } from '../category/schemas/category.schema';
import { CategoryController } from './controllers/category.controller';
import { CategoryCollectionService } from './services/category-collection.service';
import { CategoryService } from './services/category.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])],
    controllers: [CategoryController],
    providers: [CategoryCollectionService, CategoryService],
    exports: [CategoryService],
})
export class CategoryModule {}
