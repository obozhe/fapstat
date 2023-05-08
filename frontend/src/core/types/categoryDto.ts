export interface CategoryDto {
    createdAt: Date;
    groupBy: 'general' | 'custom';
    id: string;
    updatedAt: string;
    user: string;
    value: string;
}
