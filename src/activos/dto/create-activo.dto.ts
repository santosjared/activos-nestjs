import {
  IsString,
  IsNumber,
  IsOptional,
  IsDate,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsPositive
} from 'class-validator'
import { Type } from 'class-transformer'

export class CreateActivoDto {
  @IsNotEmpty({ message: 'El campo código es requerido' })
  @MinLength(4, { message: 'El campo código debe tener al menos 4 caracteres' })
  @MaxLength(16, { message: 'El campo código no debe exceder 16 caracteres' })
  @IsString({ message: 'El campo código debe ser una cadena de caracteres' })
  code: string

  @IsNotEmpty({ message: 'El campo nombre es requerido' })
  @MinLength(2, { message: 'El campo nombre debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El campo nombre no debe exceder más de 50 caracteres' })
  @IsString({ message: 'El campo nombre debe ser una cadena de caracteres' })
  name: string

  @IsNotEmpty({ message: 'Seleccione un responsable para el activo' })
  @IsString({ message: 'El id del responsable debe ser una cadena de caracteres' })
  responsable: string

  @IsNotEmpty({ message: 'Seleccione el lugar donde se encuentra el activo' })
  @IsString({ message: 'El id del lugar donde se encuentra el activo debe ser una cadena de caracteres' })
  location: string

  @Type(() => Number)
  @IsNotEmpty({ message: 'El campo precio de adquisición es requerido' })
  @IsNumber({}, { message: 'El campo precio debe ser un número' })
  @IsPositive({ message: 'El precio debe ser un número positivo' })
  price_a: number

  @Type(() => Date)
  @IsNotEmpty({ message: 'El campo fecha de adquisición es requerido' })
  @IsDate({ message: 'La fecha de adquisición no es válida' })
  date_a: Date

  @IsNotEmpty({ message: 'Seleccione un estado del activo' })
  @IsString({ message: 'El id del estado debe ser una cadena de caracteres' })
  status: string

  @IsOptional()
  @MinLength(3, { message: 'El estado del activo debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El estado del activo no debe exceder más de 50 caracteres' })
  @IsString({ message: 'El campo estado debe ser una cadena de caracteres' })
  otherStatus?: string

  @IsOptional()
  @IsString({ message: 'El campo imageUrl debe ser una cadena de caracteres' })
  imageUrl?: string

  @IsNotEmpty({ message: 'Seleccione una categoría del activo' })
  @IsString({ message: 'El id de la categoría debe ser una cadena de caracteres' })
  category: string

  @IsOptional()
  @IsString({ message: 'El id del sub categoría debe ser una cadena de caracteres' })
  subcategory: string

  @IsOptional()
  @MinLength(3, { message: 'El lugar donde se encuentra debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El lugar donde se encuentra el activo no debe exceder más de 50 caracteres' })
  @IsString({ message: 'El lugar donde se encuentra el activo debe ser una cadena de texto' })
  otherLocation?: string

  @IsOptional()
  @MinLength(10, { message: 'La descripción debe tener al menos 10 caracteres' })
  @MaxLength(1000, { message: 'La descripción no debe superar los 1000 caracteres' })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  description?: string

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'La fecha de egreso no es válida' })
  date_e?: Date
}
