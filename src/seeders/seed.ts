import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { SeedService } from './seed.service';
import { ContableSeed } from './contable-seed.service';
import { StatusSeed } from './status-seed.service';
import { LocationSeed } from './location-seed.service';
import { GradeSeed } from './grade-seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedModule);
  const seedService = app.get(SeedService);
  const seedContable = app.get(ContableSeed);
  const seedStatus = app.get(StatusSeed);
  const seedLocation = app.get(LocationSeed);
  const seedGrade = app.get(GradeSeed)

  await seedService.onModuleInit();
  await seedContable.seed();
  await seedStatus.seed();
  await seedLocation.seed();
  await seedGrade.seed()
  
  await app.close();
}

bootstrap();
