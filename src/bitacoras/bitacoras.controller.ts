import { Controller, Get, Query } from '@nestjs/common';
import { BitacorasService } from './bitacoras.service';
import { Bitacora } from './decorator/bitacora.decorator';
import { FiltersBitacoraDto } from './dto/filters-bitacora.dto';

@Controller('bitacoras')
export class BitacorasController {
  constructor(private readonly bitacorasService: BitacorasService) {}

  @Bitacora('Selecionar bitacoras')
  @Get()
  async findAll(@Query() filters:FiltersBitacoraDto) {
    return await this.bitacorasService.findAll(filters);
  }

}
