import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Rol, RolSchema } from './schema/roles.schema';
import { Permission, PermissionsSchema } from 'src/permissions/schema/persmissions.schema';

@Module({
  imports:[MongooseModule.forFeature([
    {name:Rol.name,
      schema:RolSchema
    }
  ]),
  MongooseModule.forFeature([{
    name:Permission.name,
    schema:PermissionsSchema
  }])
],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
