import { Module } from '@nestjs/common';
import { EntregaService } from './entrega.service';
import { EntregaController } from './entrega.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Activos, ActivosSchema } from 'src/activos/schema/activos.schema';
import { Contable, ContableSchema } from 'src/contable/schema/contable.schema';
import { SubCategory, SubCategorySchema } from 'src/contable/schema/sub-category.schema';
import { Status, StatusSchema } from 'src/activos/schema/status.schema';
import { Users, UsersSchema } from 'src/users/schema/users.schema';
import { LocationSchema, Location} from 'src/activos/schema/location.schema';
import { Entrega, EntregaSchema } from './schema/entrega.schema';
import { Grade, GradeSchema } from 'src/users/schema/grade.schema';

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
    ])],
  controllers: [EntregaController],
  providers: [EntregaService],
})
export class EntregaModule {}
