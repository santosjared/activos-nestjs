import { IsOptional, IsNumberString, IsString } from 'class-validator';

export class FiltersEntregaDto {
  @IsOptional()
  @IsString()
  field?: string;

  @IsOptional()
  @IsNumberString()
  skip?: number;

  @IsOptional()
  @IsNumberString()
  limit?: number;

  @IsOptional()
  @IsString()
  id?:string
}
