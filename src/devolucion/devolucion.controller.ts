import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DevolucionService } from './devolucion.service';
import { CreateDevolucionDto } from './dto/create-devolucion.dto';
import { UpdateDevolucionDto } from './dto/update-devolucion.dto';
import { FiltersDevolucionDto } from './dto/filters-devolucion.dto';

@Controller('devolucion')
export class DevolucionController {
  constructor(private readonly devolucionService: DevolucionService) { }

  @Post()
  async create(@Body() createDevolucionDto: CreateDevolucionDto) {
    return await this.devolucionService.create(createDevolucionDto);
  }

  @Get()
  async findAll(@Query() filters: FiltersDevolucionDto) {
    return await this.devolucionService.findAll(filters);
  }

  @Get('entregas')
  async finEntregas(@Query() filters: FiltersDevolucionDto) {
    return await this.devolucionService.findEntregas(filters);
  }
  @Get('options')
  async options() {
    return await this.devolucionService.options();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.devolucionService.findOne(+id);
  }

  @Get('entregas/:id')
  findOneEntrega(@Param('id') id: string) {
    return this.devolucionService.findOneEntrega(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDevolucionDto: UpdateDevolucionDto) {
    return this.devolucionService.update(+id, updateDevolucionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.devolucionService.remove(+id);
  }
}
