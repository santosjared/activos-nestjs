import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateRolDto } from './dto/create-roles.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { CreatePermissionDto } from 'src/roles/dto/create-permission.dto';
import { FiltersRolesDto } from './dto/filters-roles.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { PermissionsGuard } from 'src/casl/guards/permissions.guard';
import { CheckAbilities } from 'src/casl/decorators/permission.decorator'

@Controller('roles')
@ApiTags('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'create', subject: 'roles' })
  @Post()
  create(@Body() createRolDto: CreateRolDto) {
    return this.rolesService.create(createRolDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'read', subject: 'roles' })
  @Get()
  async findAll(@Query() filters: FiltersRolesDto) {
    return await this.rolesService.findAll(filters)
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'update', subject: 'roles' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.rolesService.findOne(id)
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'permissions', subject: 'roles' })
  @Get('permissions/:id')
  async findRole(@Param('id') id: string) {
    return await this.rolesService.findRole(id)
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'update', subject: 'roles' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateRolDto: UpdateRolDto) {
    return await this.rolesService.update(id, updateRolDto)
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'permissions', subject: 'roles' })
  @Put('asigne-permissions/:id')
  async asignePermission(@Param('id') id: string, @Body() createPermission: CreatePermissionDto) {
    return await this.rolesService.asignePermission(id, createPermission)
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'delete', subject: 'roles' })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.rolesService.delete(id)
  }

}
