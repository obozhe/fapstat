import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

import { User } from '@m/auth/decorators/user.decorator';
import { AuthJWTGuard } from '@m/auth/guards/auth-jwt.guard';
import { UserDTO } from '@m/user/models/user-dto';

import { CreateCategoryDTO } from '../models/create-category-dto';
import { DeleteCategoriesDTO } from '../models/delete-categories-dto';
import { CategoryCollectionService } from '../services/category-collection.service';

@ApiTags('categories')
@ApiCookieAuth()
@UseGuards(AuthJWTGuard)
@Controller('/api/categories')
export class CategoryController {
    constructor(private readonly categoryCollection: CategoryCollectionService) {}

    @Post('/')
    public async create(@Body() body: CreateCategoryDTO, @User() user: UserDTO) {
        return await this.categoryCollection.create(user.id, body);
    }

    @Get('/combined')
    public async getCombined(@User() user: UserDTO) {
        return await this.categoryCollection.getCombined(user.id);
    }

    @Get('/my')
    public async getMy(@User() user: UserDTO) {
        return await this.categoryCollection.findByUser(user.id);
    }

    @Patch('/my/:id')
    public async updateMy(
        @User() { id: userId }: UserDTO,
        @Param('id') id: string,
        @Body() { value }: CreateCategoryDTO
    ) {
        const category = await this.categoryCollection.findById(id);
        if (String(category.user) !== userId) {
            throw new ForbiddenException();
        }

        category.value = value;
        return await category.save();
    }

    @Delete('/my')
    public async deleteMyMany(@User() { id: userId }: UserDTO, @Body() { ids }: DeleteCategoriesDTO) {
        const categories = await this.categoryCollection.findByIds(ids);
        if (categories.some(({ user }) => String(user) !== userId)) {
            throw new ForbiddenException();
        }

        return await this.categoryCollection.deleteMany(ids);
    }
}
