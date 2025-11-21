import { Module } from '@nestjs/common';
import { DepreciacionService } from './depreciacion.service';
import { DepreciacionController } from './depreciacion.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Activos, ActivosSchema } from 'src/activos/schema/activos.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports:[MongooseModule.forFeature([{
    name:Activos.name, schema:ActivosSchema
  }]),
  CaslModule
],
  controllers: [DepreciacionController],
  providers: [DepreciacionService],
})
export class DepreciacionModule {}
