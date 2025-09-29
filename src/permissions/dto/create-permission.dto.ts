import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsString } from 'class-validator'
import { Actions, Subjects } from '../schema/persmissions.schema'

export class CreatePermissionDto {
  @ApiProperty({ type: () => [PermissionItemDto] })
  @IsArray()
  permissions: PermissionItemDto[]
}

export class PermissionItemDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  action: Actions[]

  @ApiProperty()
  @IsString()
  subject: Subjects
}
