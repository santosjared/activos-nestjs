import { IsArray, IsString } from "class-validator";

export class DisableEnamebleDto {
    @IsArray()
    @IsString({ each: true })
    activos: string[];
}
