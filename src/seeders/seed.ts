import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { SeedService } from './seed.service';
import { CategorySeed } from './category-seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedModule);
  const seedService = app.get(SeedService);
  const seedCategory = app.get(CategorySeed);

  await seedService.onModuleInit();
  await seedCategory.seed();
  await app.close();
}

bootstrap();
