import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteCategoriesDTO {
    @ApiProperty()
    @IsString({ each: true })
    ids: string[];
}
