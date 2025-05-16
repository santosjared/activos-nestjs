import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateRolDto } from './dto/create-roles.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { CreatePermissionDto } from 'src/permissions/dto/create-permission.dto';

@Controller('roles')
@ApiTags('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}
  
  @Post()
  create(@Body() createRolDto:CreateRolDto){
    return this.rolesService.create(createRolDto);
  }

  @Get()
  async findAll(@Query() filters:any){
    return await this.rolesService.findAll(filters)
  }

  @Put(':id')
  async update(@Param('id') id:string, @Body() updateRolDto:UpdateRolDto){
    return await this.rolesService.update(id, updateRolDto)
  }

  @Put('asigne-permissions/:id')
  async asignePermission(@Param('id')id:string, @Body() createPermission:CreatePermissionDto){
    return await this.rolesService.asignePermission(id,createPermission)
  }
  
  @Delete(':id')
  async delete(@Param('id') id:string){
    return await this.rolesService.delete(id)
  }

}
