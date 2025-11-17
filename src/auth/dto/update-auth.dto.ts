import { PartialType } from '@nestjs/mapped-types';
import { CreadencialesAuthDto } from './credenciales-auth.dto';

export class UpdateAuthDto extends PartialType(CreadencialesAuthDto) {}
