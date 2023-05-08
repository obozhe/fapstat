import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class GetUserIdDTO {
    @ApiProperty()
    @IsEmail()
    email: string;
}
