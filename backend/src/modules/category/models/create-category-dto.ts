import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDTO {
    @ApiProperty()
    @MinLength(1)
    @MaxLength(25)
    value: string;
}
