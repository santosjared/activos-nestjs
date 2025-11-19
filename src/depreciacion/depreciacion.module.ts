import { Module } from '@nestjs/common';
import { DepreciacionService } from './depreciacion.service';
import { DepreciacionController } from './depreciacion.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Activos, ActivosSchema } from 'src/activos/schema/activos.schema';

@Module({
  imports:[MongooseModule.forFeature([{
    name:Activos.name, schema:ActivosSchema
  }])],
  controllers: [DepreciacionController],
  providers: [DepreciacionService],
})
export class DepreciacionModule {}
