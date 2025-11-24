import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { BitacorasService } from './bitacoras.service';
import { Bitacora } from './decorator/bitacora.decorator';
import { FiltersBitacoraDto } from './dto/filters-bitacora.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { PermissionsGuard } from 'src/casl/guards/permissions.guard';
import { CheckAbilities } from 'src/casl/decorators/permission.decorator'

@Controller('bitacoras')
export class BitacorasController {
  constructor(private readonly bitacorasService: BitacorasService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
    @CheckAbilities({ action: 'read', subject: 'bitacora' })
  @Bitacora('Selecionar bitacoras')
  @Get()
  async findAll(@Query() filters:FiltersBitacoraDto) {
    return await this.bitacorasService.findAll(filters);
  }

}
