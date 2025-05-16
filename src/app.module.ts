import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { SubjectModule } from './subject/subject.module';
import { ActionModule } from './action/action.module';
import { ConfigModule } from '@nestjs/config';
import environment from './config/environment';
import getConfig from './config/environment'
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal:true,
    load:[environment]
    
  }),
  MongooseModule.forRoot(getConfig().MONGO_URI), 
    AuthModule, UsersModule, RolesModule, PermissionsModule, SubjectModule, ActionModule],
})
export class AppModule {}
