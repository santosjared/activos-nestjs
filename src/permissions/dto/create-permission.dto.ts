import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsString } from 'class-validator'

export class CreatePermissionDto {
  @ApiProperty({ type: () => [PermissionItemDto] })
  @IsArray()
  permissions: PermissionItemDto[]
}

export class PermissionItemDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  action: string[] // IDs de acciones

  @ApiProperty()
  @IsString()
  subject: string // ID de subject
}
