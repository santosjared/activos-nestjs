import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { ConfigModule } from '@nestjs/config';
import environment from './config/environment';
import getConfig from './config/environment'
import { MongooseModule } from '@nestjs/mongoose';
import { ActivosModule } from './activos/activos.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EntregaModule } from './entrega/entrega.module';
import { ContableModule } from './contable/contable.module';
import { DevolucionModule } from './devolucion/devolucion.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal:true,
    load:[environment]
    
  }),
  MongooseModule.forRoot(getConfig().MONGO_URI,{
  autoIndex: false,
}), 
    AuthModule, UsersModule, RolesModule, ActivosModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads', 'images'),
      serveRoot: '/images',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads', 'documents'),
      serveRoot: '/documents',
    }),
    EntregaModule,
    ContableModule,
    DevolucionModule,
  ],
})
export class AppModule {}
