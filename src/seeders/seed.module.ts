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
      { name: Category.name, schema: CategorySchema }
    ]),
  ],
  providers: [SeedService, CategorySeed],
})
export class SeedModule {}
