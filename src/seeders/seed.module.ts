import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Rol, RolSchema } from '../roles/schema/roles.schema';
import { Users, UsersSchema } from '../users/schema/users.schema';
import environment from '../config/environment';
import getConfig from '../config/environment';
import { ContableSeed } from './contable-seed.service';
import { Status, StatusSchema } from 'src/activos/schema/status.schema';
import { StatusSeed } from './status-seed.service';
import { Location, LocationSchema } from 'src/activos/schema/location.schema';
import { LocationSeed } from './location-seed.service';
import { Grade, GradeSchema } from 'src/users/schema/grade.schema';
import { GradeSeed } from './grade-seed.service';
import { Contable, ContableSchema } from 'src/contable/schema/contable.schema';
import { AuthSeedService } from './auth-seed.service';
import { Auth, AuthSchema } from 'src/auth/schema/auth.schema';
import { Permission, PermissionsSchema } from 'src/roles/schema/permission.schema';


@Module({
  imports: [
    ConfigModule.forRoot({
        isGlobal:true,
        load:[environment]
        
      }),
    MongooseModule.forRoot(getConfig().MONGO_URI),
    MongooseModule.forFeature([
      { name: Users.name, schema: UsersSchema },
      { name: Rol.name, schema: RolSchema },
      { name: Contable.name, schema: ContableSchema },
      { name: Status.name, schema: StatusSchema },
      { name: Location.name, schema: LocationSchema },
      { name: Grade.name, schema:GradeSchema },
      { name: Contable.name, schema: ContableSchema },
      { name: Auth.name, schema: AuthSchema },
      { name: Permission.name, schema:PermissionsSchema },
    ]),
  ],
  providers: [AuthSeedService, ContableSeed, StatusSeed, LocationSeed, GradeSeed],
})
export class SeedModule {}
