import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { PermissionsGuard } from 'src/casl/guards/permissions.guard';
import { CheckAbilities } from 'src/casl/decorators/permission.decorator'
import { Bitacora } from 'src/bitacoras/decorator/bitacora.decorator';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService:DashboardService) { }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'read', subject: 'dashboard' })
  @Bitacora('Solicitud de dashboard')
  @Get()
  async findAll() {
    return await this.dashboardService.findAll();
  }

}
