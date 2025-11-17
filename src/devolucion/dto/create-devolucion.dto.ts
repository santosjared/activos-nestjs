import { Transform } from "class-transformer";
import { IsArray, IsDateString, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength, ValidateIf } from "class-validator";

export class CreateDevolucionDto {
    @IsNotEmpty({ message: 'La fecha de entrega es obligatoria' })
    @IsString()
    date: string;

    @IsNotEmpty()
    @IsString()
    code: string

    @IsNotEmpty({ message: 'La hora de entrega es obligatoria' })
    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'Ingrese una hora válida (HH:mm)',
    })
    time: string;

    @IsNotEmpty({ message: 'usuario que entrega es obligatorio' })
    @IsString({ message: 'El id del usuario debe ser una cadena de caracteres' })
    user_en: string;

    @IsNotEmpty({ message: 'usuario que entrega es obligatorio' })
    @IsString({ message: 'El id del usuario debe ser una cadena de caracteres' })
    user_rec: string;

    @IsArray({ message: 'La lista de activos debe ser un arreglo' })
    @IsNotEmpty({ message: 'Debe seleccionar al menos un activo' })
    activos: string[];

    @IsOptional()
    @IsString({ message: 'La URL del documento debe ser una cadena de texto' })
    documentUrl?: string;

    @IsOptional()
    @ValidateIf(o => o.description && o.description.trim() !== '')
    @MinLength(10, { message: 'La descripción debe tener al menos 10 caracteres' })
    @MaxLength(1000, { message: 'La descripción no debe superar los 1000 caracteres' })
    description?: string;
}
