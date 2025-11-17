import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CaslAbilityFactory } from 'src/config/acl';
import { RolesService } from 'src/roles/roles.service';
import { Permission, PermissionsSchema } from 'src/roles/schema/permission.schema';
import { Rol, RolSchema } from 'src/roles/schema/roles.schema';

@Module({
    imports:[MongooseModule.forFeature([
        {name:Rol.name,
          schema:RolSchema
        }
      ]),
      MongooseModule.forFeature([{
        name:Permission.name,
        schema:PermissionsSchema
      }]),],
    providers: [CaslAbilityFactory,RolesService],
    exports: [CaslAbilityFactory],
})
export class CaslModule { }
