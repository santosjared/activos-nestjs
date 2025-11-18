import { Module } from '@nestjs/common';
import { DevolucionService } from './devolucion.service';
import { DevolucionController } from './devolucion.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Activos, ActivosSchema } from 'src/activos/schema/activos.schema';
import { Contable, ContableSchema } from 'src/contable/schema/contable.schema';
import { SubCategory, SubCategorySchema } from 'src/contable/schema/sub-category.schema';
import { Status, StatusSchema } from 'src/activos/schema/status.schema';
import { Users, UsersSchema } from 'src/users/schema/users.schema';
import { Entrega, EntregaSchema } from 'src/entrega/schema/entrega.schema';
import { Grade, GradeSchema } from 'src/users/schema/grade.schema';
import { LocationSchema, Location } from 'src/activos/schema/location.schema';
import { Devolucion, DevolucionSchema } from './schema/devolucion.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
   imports:[MongooseModule.forFeature([
        { name:Activos.name, schema:ActivosSchema },
        { name:Contable.name, schema:ContableSchema},
        { name:SubCategory.name, schema:SubCategorySchema},
        { name:Status.name, schema:StatusSchema},
        { name:Location.name, schema:LocationSchema},
        { name:Users.name, schema:UsersSchema},
        { name:Entrega.name, schema:EntregaSchema},
        { name:Grade.name, schema:GradeSchema},
        { name:Devolucion.name, schema:DevolucionSchema },
     ]),
     CaslModule
   ],
  controllers: [DevolucionController],
  providers: [DevolucionService],
})
export class DevolucionModule {}
