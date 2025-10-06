import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { SeedService } from './seed.service';
import { CategorySeed } from './category-seed.service';
import { StatusSeed } from './status-seed.service';
import { LocationSeed } from './location-seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedModule);
  const seedService = app.get(SeedService);
  const seedCategory = app.get(CategorySeed);
  const seedStatus = app.get(StatusSeed);
  const seedLocation = app.get(LocationSeed);

  await seedService.onModuleInit();
  await seedCategory.seed();
  await seedStatus.seed();
  await seedLocation.seed();
  await app.close();
}

bootstrap();
