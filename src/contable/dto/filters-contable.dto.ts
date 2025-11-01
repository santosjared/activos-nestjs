import { IsOptional, IsNumberString, IsString } from 'class-validator';

export class FiltersContableDto {
  @IsOptional()
  @IsString()
  field?: string;

  @IsOptional()
  @IsNumberString()
  skip?: number;

  @IsOptional()
  @IsNumberString()
  limit?: number;
}
