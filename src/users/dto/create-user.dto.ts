import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';

export class CreateUserDto {

    @ApiProperty()
  @IsString({ message: 'El campo grado es requerido' })
  @IsNotEmpty({ message: 'Debe seleccionar un grado' })
  @Transform(({ value }) => value?.toString())
  grade: string;

  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ValidateIf((o) => o.grade === 'Otro')
  @IsString({ message: 'El campo otro grado debe ser una cadena de texto' })
  @Length(2, 50, {
    message: 'El campo otro grado debe tener entre 2 y 50 caracteres',
  })
  otherGrade?: string;

  @ApiProperty()
  @IsString({ message: 'El campo nombres es requerido' })
  @Transform(({ value }) => value?.trim())
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
    message: 'El nombre solo debe contener letras',
  })
  @Length(4, 50, {
    message: 'El campo nombres debe tener entre 4 y 50 caracteres',
  })
  name: string;

  @ApiProperty()
  @IsString({ message: 'El campo apellidos es requerido' })
  @Transform(({ value }) => value?.trim())
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
    message: 'El apellido solo debe contener letras',
  })
  @Length(4, 50, {
    message: 'El campo apellidos debe tener entre 4 y 50 caracteres',
  })
  lastName: string;

  @ApiProperty()
  @Transform(({ value }) => value?.trim())
  @IsEmail({}, { message: 'El correo electrónico debe ser un correo electrónico válido' })
  @Length(1, 100, {
    message: 'El campo correo electrónico no debe tener más de 100 caracteres',
  })
  email: string;

  @ApiProperty()
  @IsString({ message: 'El campo CI es requerido' })
  @Transform(({ value }) => value?.trim())
  @Length(4, 20, {
    message: 'El campo CI debe tener entre 4 y 20 caracteres',
  })
  ci: string;

  @ApiProperty()
  @IsString({ message: 'Seleccione la expedición del carnet' })
  @Transform(({ value }) => value?.trim())
  @Length(2, 20, {
    message: 'El campo expedición debe tener entre 2 y 20 caracteres',
  })
  exp: string;

  @ApiProperty()
  @Transform(({ value }) =>
    typeof value === 'number' ? value.toString() : value?.trim(),
  )
  @IsString({ message: 'El campo celular es requerido' })
  @Matches(/^[0-9]+$/, { message: 'El celular debe contener solo números' })
  @Length(6, 15, {
    message: 'El campo celular debe tener entre 6 y 15 caracteres',
  })
  phone: string;

  @ApiProperty()
  @IsString({ message: 'El campo dirección es requerido' })
  @Transform(({ value }) => value?.trim())
  @Length(3, 100, {
    message: 'El campo dirección debe tener entre 3 y 100 caracteres',
  })
  address: string;

  @ApiProperty()
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() === '' ? undefined : value?.trim(),
  )
  @IsOptional()
  @IsString({ message: 'El campo contraseña debe ser una cadena de caracteres' })
  @Length(8, 32, {
    message: 'La contraseña debe tener entre 8 y 32 caracteres',
  })
  password?: string;
  
  @ApiProperty()
  @IsString({ message: 'Debe seleccionar algún sexo' })
  @Length(2, 10, {
    message: 'El campo sexo debe tener entre 2 y 10 caracteres',
  })
  gender: string;

  @ApiProperty({ type: [String] })
  @IsArray({ message: 'Los roles deben ser un arreglo de IDs' })
  @IsString({ each: true, message: 'Cada rol debe ser un ID válido' })
  @ArrayMinSize(1, { message: 'Debe seleccionar al menos un rol' })
  @ArrayMaxSize(5, { message: 'No puede seleccionar más de 5 roles' })
  roles: string[];

}
