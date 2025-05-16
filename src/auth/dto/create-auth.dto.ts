import { ApiProperty } from '@nestjs/swagger';
import { IsEmail,IsString,IsStrongPassword } from 'class-validator';

export class CreateAuthDto {

    @ApiProperty()
    @IsEmail()
    @IsString()
    email: string;

    @ApiProperty()
    // @IsStrongPassword()
    @IsString()
    password: string;
}
