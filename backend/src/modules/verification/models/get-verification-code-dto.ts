import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

export class GetVerificationCodeDTO {
    @ApiProperty()
    @Matches(/^[a-f\d]{24}$/i)
    userId: string;
}
