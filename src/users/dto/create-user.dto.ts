import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsOptional,IsString, Length, Matches, ValidateIf} from 'class-validator';

export class CreateUserDto{

    @ApiProperty()
    @IsString({ message: 'El campo nombre debe ser una cadena de caracteres de Aa - Zz' })
    @Matches(/^[A-Za-z\s]+$/, { message: 'El nombre solo puede contener letras y espacios' })
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @Length(4, 20)
    name: string

    @ApiProperty()
    @Matches(/^[A-Za-z\s]+$/, { message: 'El nombre solo puede contener letras y espacios' })
    @IsString({ message: 'El campo apellido debe ser una cadena de caracteres Aa - Zz' })
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @Length(4, 20)
    lastName: string

    @ApiProperty()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @Length(8, 64)
    @IsEmail()
    email: string

    @ApiProperty()
    @IsString()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @Length(8, 32)
    password: string

    @ApiProperty()
    @Transform(({ value }) => {
        if (typeof value === 'number') return value.toString();
        if (typeof value === 'string') return value.trim();
        return value;
    })
    @ValidateIf(({ phone }) => typeof phone === 'string' || typeof phone === 'number')
    @IsString()
    @Length(6, 8)
    phone: string

    @IsOptional()
    @IsString()
    profile: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    rol: string

    @ApiProperty()
    @IsString()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    ci:String
    @ApiProperty()
    @IsString()
    gender:string
    @ApiProperty()
    @IsString()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    address:string
    @ApiProperty()
    @IsOptional()
    @IsString()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    otherGender:string
    
    @IsOptional()
    @IsString()
    status:string
}
