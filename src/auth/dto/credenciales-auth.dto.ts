
import { 
  IsEmail, 
  IsNotEmpty, 
  IsString, 
  MinLength, 
  MaxLength,
  IsBoolean,
  IsOptional, 
} from 'class-validator';

export class CreadencialesAuthDto {

  @IsEmail({}, { message: 'El correo electrónico no tiene un formato válido.' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  email: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  @MaxLength(20, { message: 'La contraseña no debe superar los 20 caracteres.' })
  password: string;

  @IsOptional()
  @IsBoolean({ message: 'El campo rememberMe debe ser un valor booleano.' })
  rememberMe: boolean;
}

