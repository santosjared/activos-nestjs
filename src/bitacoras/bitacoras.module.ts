import { Module } from '@nestjs/common';
import { BitacorasService } from './bitacoras.service';
import { BitacorasController } from './bitacoras.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Bitacoras, BitacorasSchema } from './schema/bitacoras.schema';
import { UsersModule } from 'src/users/users.module';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports:[MongooseModule.forFeature([
    { name: Bitacoras.name, schema:BitacorasSchema }
  ]),
  UsersModule,
  CaslModule
],
  controllers: [BitacorasController],
  providers: [BitacorasService],
  exports:[MongooseModule]
})
export class BitacorasModule {}
