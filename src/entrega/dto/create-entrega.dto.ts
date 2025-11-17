import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Matches,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateEntregaDto {
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
  @Transform(({ value }) => value?.trim())
  @IsString({ message: 'El lugar donde se entrega el activo debe ser una cadena de texto' })
  @MinLength(3, { message: 'La ubicación donde se entrega el activo debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'La ubicación donde se entrega el activo no debe exceder los 50 caracteres' })
  otherLocation?: string;

  @IsOptional()
  @ValidateIf(o => o.description && o.description.trim() !== '')
  @MinLength(10, { message: 'La descripción debe tener al menos 10 caracteres' })
  @MaxLength(1000, { message: 'La descripción no debe superar los 1000 caracteres' })
  description?: string;
}
