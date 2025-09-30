import { Module } from '@nestjs/common';
import { ActivosService } from './activos.service';
import { ActivosController } from './activos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Activos, ActivosSchema } from './schema/activos.schema';
import { Category, CategorySchema } from './schema/category.schema';
import { Status, StatusSchema } from './schema/status.schema';

@Module({
  imports:[MongooseModule.forFeature([
    { name:Activos.name, schema:ActivosSchema },
    { name:Category.name, schema:CategorySchema},
    { name:Status.name, schema:StatusSchema},
  ])],
  controllers: [ActivosController],
  providers: [ActivosService],
})
export class ActivosModule {}
