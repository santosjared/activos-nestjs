import { Module } from '@nestjs/common';
import { BitacorasService } from './bitacoras.service';
import { BitacorasController } from './bitacoras.controller';

@Module({
  controllers: [BitacorasController],
  providers: [BitacorasService],
})
export class BitacorasModule {}
