import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateActivoDto {
    @ApiProperty()
    @IsString()
    code: string;

    @IsString()
    name: string;

    @IsString()
    location: string;

    @Type(() => Number)
    @IsNumber()
    price_a: number;

    @Type(() => Number)
    @IsNumber()
    cantidad: number;

    @Type(() => Date)
    @IsDate()
    date_a: Date;

    @Type(() => Date)
    @IsDate()
    date_e: Date;

    @IsString()
    @IsOptional()
    status: string;

    @IsString()
    @IsOptional()
    otherStatus:string

    @IsString()
    @IsOptional()
    imageUrl: string;

    @IsString()
    @IsOptional()
    category:string
    
    @IsString()
    @IsOptional()
    otherCategory:string

    @IsString()
    @IsOptional()
    description:string

}
