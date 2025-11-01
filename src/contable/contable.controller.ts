import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ContableService } from './contable.service';
import { FiltersContableDto } from './dto/filters-contable.dto';
import { CreateContableDto } from './dto/create-contable.dto';
import { UpdateContableDto } from './dto/update-contable.dto';

@Controller('contables')
export class ContableController {
  constructor(private readonly contableService: ContableService) { }
  @Post()
  async create(@Body() createContableDto: CreateContableDto) {
    return await this.contableService.create(createContableDto);
  }
  @Get()
  async findAll(@Query() filters: FiltersContableDto) {
    return await this.contableService.findAll(filters)
  }
  @Get('subcategories')
  async finSUb(){
    return await this.contableService.findSub()
  }
   @Put(':id')
    async update(@Param('id') id: string, @Body() updateContableDto: UpdateContableDto) {
      return await this.contableService.update(id, updateContableDto);
    }
    @Delete(':id')
    async remove(@Param('id') id: string){
      return await this.contableService.remove(id)
    }
}
