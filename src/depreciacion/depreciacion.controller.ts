import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DepreciacionService } from './depreciacion.service';
import { FiltersDepreciacionDto } from './dto/filters-depreciacion.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { PermissionsGuard } from 'src/casl/guards/permissions.guard';
import { CheckAbilities } from 'src/casl/decorators/permission.decorator'

@Controller('depreciacion')
export class DepreciacionController {
  constructor(private readonly depreciacionService: DepreciacionService) { }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'read', subject: 'depreciacion' })
  @Get()
  findAll(@Query() filters: FiltersDepreciacionDto) {
    return this.depreciacionService.findAll(filters);
  }
}
