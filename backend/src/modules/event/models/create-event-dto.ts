import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateEventDTO {
    @ApiProperty()
    @IsDateString()
    date: string;

    @ApiProperty()
    @IsNumber()
    @Min(0.5)
    @Max(300)
    duration: number;

    @ApiProperty()
    @IsInt()
    @Min(1)
    @Max(5)
    rating: string;

    @ApiProperty()
    @IsString({ each: true })
    categories: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @MaxLength(500)
    description: string;
}
