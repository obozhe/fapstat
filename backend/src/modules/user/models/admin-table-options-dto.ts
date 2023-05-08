import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, ValidateNested } from 'class-validator';

class AdminTableOptionsFilters {
    @ApiProperty()
    @IsBoolean()
    banned: boolean;
}

export class AdminTableOptionsDTO {
    @ApiProperty()
    @ValidateNested()
    @Type(() => AdminTableOptionsFilters)
    filters: AdminTableOptionsFilters;

    @ApiProperty()
    @IsInt()
    page: number;

    @ApiProperty()
    @IsInt()
    pageSize: number;
}
