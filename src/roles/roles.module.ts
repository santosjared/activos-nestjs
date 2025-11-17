import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Rol, RolSchema } from './schema/roles.schema';
import { Permission, PermissionsSchema } from './schema/permission.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports:[MongooseModule.forFeature([
    { name:Rol.name, schema:RolSchema },
    { name:Permission.name, schema:PermissionsSchema },
  ]),
  CaslModule,
],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
