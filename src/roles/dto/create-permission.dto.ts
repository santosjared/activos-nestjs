import {
  IsArray,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Actions, Subjects } from 'src/types/permission-types';

export class PermissionItemDto {
  @IsArray({ message: 'El campo action debe ser un arreglo' })
  @IsString({ each: true, message: 'Cada acción debe ser una cadena de texto' })
  action: Actions[];

  @IsString({ message: 'El campo subject debe ser una cadena de texto' })
  subject: Subjects;

  @IsOptional()
  @IsString({ message: 'El campo _id debe ser una cadena de texto' })
  _id?: string;
}

export class CreatePermissionDto {
  @IsArray({ message: 'El campo permissions debe ser un arreglo' })
  @ValidateNested({ each: true })
  @Type(() => PermissionItemDto)
  permissions: PermissionItemDto[];
}
