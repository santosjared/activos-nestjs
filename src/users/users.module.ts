import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { Users, UsersSchema } from './schema/users.schema';
import { Rol, RolSchema } from 'src/roles/schema/roles.schema';

@Module({
  imports:[MongooseModule.forFeature([{
    name:Users.name,
    schema:UsersSchema
  }
  ]),
  MongooseModule.forFeature([{
    name:Rol.name,
    schema:RolSchema
  }])
],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
