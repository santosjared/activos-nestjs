import { Type } from 'class-transformer'
import {
    IsArray,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsPositive,
    Max,
    MaxLength,
    MinLength,
    ValidateNested,
    ValidateIf,
    IsString,
} from 'class-validator'

export class SubcategoriaDto {
    @IsNotEmpty({ message: 'El nombre de la subcategoría es requerido' })
    @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    @MaxLength(50, { message: 'El nombre no debe superar los 50 caracteres' })
    name: string

    @IsNotEmpty({ message: 'La vida útil es requerida' })
    @IsInt({ message: 'La vida útil debe ser un número entero' })
    @IsPositive({ message: 'La vida útil debe ser un número positivo' })
    @Max(50, { message: 'La vida útil no puede ser mayor a 50 años' })
    util: number

    @IsOptional()
    @IsString()
    _id?: string
}

export class CreateContableDto {
    @IsNotEmpty({ message: 'El nombre de la categoría es requerido' })
    @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    @MaxLength(50, { message: 'El nombre no debe superar los 50 caracteres' })
    name: string

    @ValidateIf(o => !o.subcategorias || o.subcategorias.length === 0)
    @IsNotEmpty({ message: 'La vida útil es requerida si no existen subcategorías' })
    @IsInt({ message: 'La vida útil debe ser un número entero' })
    @IsPositive({ message: 'La vida útil debe ser un número positivo' })
    @Max(50, { message: 'La vida útil no puede ser mayor a 50 años' })
    util?: number

    @IsOptional()
    @IsArray({ message: 'Las subcategorías deben estar en un arreglo' })
    @ValidateNested({ each: true })
    @Type(() => SubcategoriaDto)
    subcategory?: SubcategoriaDto[]

    @ValidateIf(o => o.description && o.description.trim() !== '')
    @MinLength(10, { message: 'La descripción debe tener al menos 10 caracteres' })
    @MaxLength(500, { message: 'La descripción no debe superar los 500 caracteres' })
    description?: string;

}
