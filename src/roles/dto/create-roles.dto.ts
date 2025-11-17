import {
  IsArray,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsUUID,
} from 'class-validator';

export class CreateRolDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede tener más de 50 caracteres' })
  name: string;

  @IsOptional()
  @IsArray({ message: 'Los permisos deben ser un arreglo' })
  @IsUUID('all', { each: true, message: 'Cada permiso debe ser un UUID válido' })
  permissions?: string[];

  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MinLength(10, {
    message: 'La descripción debe tener al menos 10 caracteres',
  })
  @MaxLength(200, {
    message: 'La descripción no puede tener más de 200 caracteres',
  })
  description?: string;
}
