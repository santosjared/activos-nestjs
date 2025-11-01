import { PartialType } from "@nestjs/swagger";
import { CreateContableDto } from "./create-contable.dto";

export class UpdateContableDto extends PartialType(CreateContableDto) {}