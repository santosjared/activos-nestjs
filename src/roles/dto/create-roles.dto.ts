import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateRolDto {

    @ApiProperty()
    @IsString()
    name:string

    @ApiProperty()
    @IsOptional()
    @IsArray({context:String})
    permissions: Array<[]>

    @ApiProperty()
    @IsOptional()
    @IsString()
    description:string
}