import { Module } from '@nestjs/common';
import { ActivosService } from './activos.service';
import { ActivosController } from './activos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Activos, ActivosSchema } from './schema/activos.schema';
import { Status, StatusSchema } from './schema/status.schema';
import { Location, LocationSchema } from './schema/location.schema';
import { Users, UsersSchema } from 'src/users/schema/users.schema';
import { Contable, ContableSchema } from 'src/contable/schema/contable.schema';
import { SubCategory, SubCategorySchema } from 'src/contable/schema/sub-category.schema';
import { CaslModule } from 'src/casl/casl.module';
import { EntregaModule } from 'src/entrega/entrega.module';
import { DevolucionModule } from 'src/devolucion/devolucion.module';

@Module({
  imports:[MongooseModule.forFeature([
    { name:Activos.name, schema:ActivosSchema },
    { name:Contable.name, schema:ContableSchema},
    { name:SubCategory.name, schema:SubCategorySchema},
    { name:Status.name, schema:StatusSchema},
    { name:Location.name, schema:LocationSchema},
    { name:Users.name, schema:UsersSchema},
  ]),
  CaslModule,
  EntregaModule,
  DevolucionModule
],
  controllers: [ActivosController],
  providers: [ActivosService],
  exports:[MongooseModule]
})
export class ActivosModule {}
