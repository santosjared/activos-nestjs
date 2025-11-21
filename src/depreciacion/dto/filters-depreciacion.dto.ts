import { Type } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class FiltersDepreciacionDto {

    @IsString()
    fecha_compra: string

    @IsString()
    fecha_final: string

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    skip?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit?: number;
    
}