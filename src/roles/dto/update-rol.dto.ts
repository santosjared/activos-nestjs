import { PartialType } from '@nestjs/swagger';
import { CreateRolDto } from './create-roles.dto';


export class UpdateRolDto extends PartialType(CreateRolDto){}