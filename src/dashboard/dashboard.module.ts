import { Module } from '@nestjs/common';
import { CaslModule } from 'src/casl/casl.module';
import { ActivosModule } from 'src/activos/activos.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { EntregaModule } from 'src/entrega/entrega.module';

@Module({
   imports:[
    EntregaModule,
    ActivosModule,
    CaslModule
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
