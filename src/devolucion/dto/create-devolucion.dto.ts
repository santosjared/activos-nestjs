import { Transform } from "class-transformer";
import { IsArray, IsDateString, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateDevolucionDto {
    @IsNotEmpty({ message: 'La fecha de entrega es obligatoria' })
    @IsDateString({}, { message: 'Por favor, ingrese una fecha válida' })
    date: string;

    @IsNotEmpty({ message: 'La hora de entrega es obligatoria' })
    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'Ingrese una hora válida (HH:mm)',
    })
    time: string;

    @IsNotEmpty({ message: 'El código de la entrega es obligatorio' })
    @IsString({ message: 'El código debe ser una cadena de texto' })
    @MaxLength(11, { message: 'El código no debe superar los 11 caracteres' })
    @Matches(/^[A-Za-z0-9]{3}-[A-Za-z0-9]{3}-[A-Za-z0-9]{3}$/, {
        message: 'El código debe tener el formato xxx-xxx-xxx (letras o números)',
    })
    code: string;

    @IsNotEmpty({ message: 'Debe seleccionar el grado del usuario que recibe' })
    @IsString({ message: 'El id del grado debe ser una cadena de caracteres' })
    grade: string;

    @Transform(({ value }) => value?.trim())
    @IsNotEmpty({ message: 'El nombre del usuario que recibe es obligatorio' })
    @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
        message: 'El nombre solo puede contener letras y espacios',
    })
    @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
    @MaxLength(50, { message: 'El nombre no debe superar los 50 caracteres' })
    name: string;

    @Transform(({ value }) => value?.trim())
    @IsNotEmpty({ message: 'El apellido del usuario que recibe es obligatorio' })
    @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
        message: 'El apellido solo puede contener letras y espacios',
    })
    @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
    @MaxLength(50, { message: 'El apellido no debe superar los 50 caracteres' })
    lastName: string;

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
    @Transform(({ value }) => value?.trim())
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    @MinLength(10, { message: 'La descripción debe tener al menos 10 caracteres' })
    @MaxLength(1000, { message: 'La descripción no debe superar los 1000 caracteres' })
    description?: string;
}
