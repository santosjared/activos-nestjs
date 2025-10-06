import { Module } from '@nestjs/common';
import { ActivosService } from './activos.service';
import { ActivosController } from './activos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Activos, ActivosSchema } from './schema/activos.schema';
import { Category, CategorySchema } from './schema/category.schema';
import { Status, StatusSchema } from './schema/status.schema';
import { Location, LocationSchema } from './schema/location.schema';
import { Users, UsersSchema } from 'src/users/schema/users.schema';
import { Entrega, EntregaSchema } from 'src/entrega/schema/entrega.schema';

@Module({
  imports:[MongooseModule.forFeature([
    { name:Activos.name, schema:ActivosSchema },
    { name:Category.name, schema:CategorySchema},
    { name:Status.name, schema:StatusSchema},
    { name:Location.name, schema:LocationSchema},
    { name:Users.name, schema:UsersSchema},
    { name:Entrega.name, schema:EntregaSchema},
  ])],
  controllers: [ActivosController],
  providers: [ActivosService],
})
export class ActivosModule {}
