import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { ConfigModule } from '@nestjs/config';
import environment from './config/environment';
import getConfig from './config/environment'
import { MongooseModule } from '@nestjs/mongoose';
import { ActivosModule } from './activos/activos.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal:true,
    load:[environment]
    
  }),
  MongooseModule.forRoot(getConfig().MONGO_URI), 
    AuthModule, UsersModule, RolesModule, PermissionsModule, ActivosModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads', 'images'),
      serveRoot: '/images',
    }),
  ],
})
export class AppModule {}
