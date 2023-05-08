import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CheckUsernameDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
    username: string;
}
