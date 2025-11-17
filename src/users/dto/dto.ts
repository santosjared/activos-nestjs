import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, Length, Matches, ValidateIf } from "class-validator";

export class UserDto {

    @IsOptional()
    @IsString({ message: 'El campo grado es requerido' })
    @IsNotEmpty({ message: 'Debe seleccionar un grado' })
    @Transform(({ value }) => value?.toString())
    grade: string;

    @IsString({ message: 'El campo nombres es requerido' })
    @Transform(({ value }) => value?.trim())
    @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
        message: 'El nombre solo debe contener letras',
    })
    @Length(4, 50, {
        message: 'El campo nombres debe tener entre 4 y 50 caracteres',
    })
    name: string;

    @IsString({ message: 'El campo apellidos es requerido' })
    @Transform(({ value }) => value?.trim())
    @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
        message: 'El apellido solo debe contener letras',
    })
    @Length(4, 50, {
        message: 'El campo apellidos debe tener entre 4 y 50 caracteres',
    })
    lastName: string;

    @IsString({ message: 'El campo CI es requerido' })
    @Transform(({ value }) => value?.trim())
    @Length(4, 10, {
        message: 'El campo CI debe tener entre 4 y 10 caracteres',
    })
    ci: string;

    @IsOptional()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @ValidateIf((o) => o.grade === 'Otro')
    @IsString({ message: 'El campo otro grado debe ser una cadena de texto' })
    @Length(2, 50, {
        message: 'El campo otro grado debe tener entre 2 y 50 caracteres',
    })
    otherGrade?: string;

    @IsOptional()
    @IsString()
    _id?: string
}