import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRolDto } from './dto/create-roles.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { CreatePermissionDto } from 'src/roles/dto/create-permission.dto';
import { FiltersRolesDto } from './dto/filters-roles.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { PermissionsGuard } from 'src/casl/guards/permissions.guard';
import { CheckAbilities } from 'src/casl/decorators/permission.decorator'
import { Bitacora } from 'src/bitacoras/decorator/bitacora.decorator';

@Controller('roles')

export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'create', subject: 'roles' })
  @Bitacora('Crear roles y permisos')
  @Post()
  create(@Body() createRolDto: CreateRolDto) {
    return this.rolesService.create(createRolDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'read', subject: 'roles' })
  @Bitacora('Seleccionar roles y permisos')
  @Get()
  async findAll(@Query() filters: FiltersRolesDto) {
    return await this.rolesService.findAll(filters)
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'update', subject: 'roles' })
  @Bitacora('Seleccionar roles y permisos')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.rolesService.findOne(id)
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'permissions', subject: 'roles' })
  @Bitacora('Seleccionar permisos')
  @Get('permissions/:id')
  async findRole(@Param('id') id: string) {
    return await this.rolesService.findRole(id)
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'update', subject: 'roles' })
  @Bitacora('Actualizar roles y permisos')
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateRolDto: UpdateRolDto) {
    return await this.rolesService.update(id, updateRolDto)
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'permissions', subject: 'roles' })
  @Bitacora('Asignar permisos')
  @Put('asigne-permissions/:id')
  async asignePermission(@Param('id') id: string, @Body() createPermission: CreatePermissionDto) {
    return await this.rolesService.asignePermission(id, createPermission)
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'delete', subject: 'roles' })
  @Bitacora('Eliminar roles y permisos')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.rolesService.delete(id)
  }

}
