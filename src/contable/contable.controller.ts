import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ContableService } from './contable.service';
import { FiltersContableDto } from './dto/filters-contable.dto';
import { CreateContableDto } from './dto/create-contable.dto';
import { UpdateContableDto } from './dto/update-contable.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { PermissionsGuard } from 'src/casl/guards/permissions.guard';
import { CheckAbilities } from 'src/casl/decorators/permission.decorator'
import { Bitacora } from 'src/bitacoras/decorator/bitacora.decorator';

@Controller('contables')
export class ContableController {
  constructor(private readonly contableService: ContableService) { }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'create', subject: 'contable' })
  @Bitacora('Crear contables')
  @Post()
  async create(@Body() createContableDto: CreateContableDto) {
    return await this.contableService.create(createContableDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'read', subject: 'contable' })
  @Bitacora('Selecionar contables')
  @Get()
  async findAll(@Query() filters: FiltersContableDto) {
    return await this.contableService.findAll(filters)
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'read', subject: 'contable' })
  @Get('subcategories')
  @Bitacora('Selecionar subcategorias')
  async finSUb() {
    return await this.contableService.findSub()
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'read', subject: 'contable' })
  @Bitacora('Selecionar un contables')
  @Get(':id')
  async finOne(@Param('id') id: string) {
    return await this.contableService.findOne(id)
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'update', subject: 'contable' })
  @Bitacora('Actualizar contables')
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateContableDto: UpdateContableDto) {
    return await this.contableService.update(id, updateContableDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'delete', subject: 'contable' })
  @Bitacora('Elimnar contables')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.contableService.remove(id)
  }
}
