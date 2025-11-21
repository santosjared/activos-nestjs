import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BitacorasService } from './bitacoras.service';
import { CreateBitacoraDto } from './dto/create-bitacora.dto';
import { UpdateBitacoraDto } from './dto/update-bitacora.dto';

@Controller('bitacoras')
export class BitacorasController {
  constructor(private readonly bitacorasService: BitacorasService) {}

  @Post()
  create(@Body() createBitacoraDto: CreateBitacoraDto) {
    return this.bitacorasService.create(createBitacoraDto);
  }

  @Get()
  findAll() {
    return this.bitacorasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bitacorasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBitacoraDto: UpdateBitacoraDto) {
    return this.bitacorasService.update(+id, updateBitacoraDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bitacorasService.remove(+id);
  }
}
