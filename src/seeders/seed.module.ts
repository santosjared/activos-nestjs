import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { Permission, PermissionsSchema } from '../permissions/schema/persmissions.schema';
import { Rol, RolSchema } from '../roles/schema/roles.schema';
import { Users, UsersSchema } from '../users/schema/users.schema';

import { SeedService } from './seed.service';

import environment from '../config/environment';
import getConfig from '../config/environment'
import { Category, CategorySchema } from 'src/activos/schema/category.schema';
import { CategorySeed } from './category-seed.service';
import { Status, StatusSchema } from 'src/activos/schema/status.schema';
import { StatusSeed } from './status-seed.service';
import { Location, LocationSchema } from 'src/activos/schema/location.schema';
import { LocationSeed } from './location-seed.service';


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
      { name: Permission.name, schema: PermissionsSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Status.name, schema: StatusSchema },
      { name: Location.name, schema: LocationSchema },
    ]),
  ],
  providers: [SeedService, CategorySeed, StatusSeed, LocationSeed],
})
export class SeedModule {}
