import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateEntregaDto {
  @IsNotEmpty({ message: 'La fecha de entrega es obligatoria' })
  @IsDateString({}, { message: 'Por favor, ingrese una fecha válida' })
  date: string;

  @IsNotEmpty({ message: 'La hora de entrega es obligatoria' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Ingrese una hora válida (HH:mm)',
  })
  time: string;

  @IsNotEmpty({ message: 'Debe seleccionar el grado del usuario que recibe' })
  @IsString({ message: 'El id del grado debe ser una cadena de caracteres' })
  grade: string;

  @IsNotEmpty({ message: 'El nombre del usuario que recibe es obligatorio' })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
    message: 'El nombre solo puede contener letras y espacios',
  })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El nombre no debe superar los 50 caracteres' })
  name: string;

  @IsNotEmpty({ message: 'El apellido del usuario que recibe es obligatorio' })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
    message: 'El apellido solo puede contener letras y espacios',
  })
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El apellido no debe superar los 50 caracteres' })
  lastName: string;

  @IsNotEmpty({ message: 'Seleccione el lugar donde se entrega el activo' })
  @IsString({ message: 'El id de la ubicación debe ser una cadena de caracteres' })
  location: string;

  @IsArray({ message: 'La lista de activos debe ser un arreglo' })
  @IsNotEmpty({ message: 'Debe seleccionar al menos un activo' })
  activos: string[];

  @IsOptional()
  @IsString({ message: 'La URL del documento debe ser una cadena de texto' })
  documentUrl?: string;

  @IsOptional()
  @IsString({ message: 'El lugar donde se entrega el activo debe ser una cadena de texto' })
  @MinLength(3, { message: 'La ubicación donde se entrega el activo debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'La ubicación donde se entrega el activo no debe exceder los 50 caracteres' })
  otherLocation?: string;

  @IsOptional()
  @IsString({ message: 'El grado debe ser una cadena de texto' })
  @MinLength(2, { message: 'El grado debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El grado no debe exceder los 50 caracteres' })
  otherGrade?: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MinLength(10, { message: 'La descripción debe tener al menos 10 caracteres' })
  @MaxLength(1000, { message: 'La descripción no debe superar los 1000 caracteres' })
  description?: string;
}
