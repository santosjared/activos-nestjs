import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import getConfig from './config/environment'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule,{cors:true});

  const config = new DocumentBuilder()
    .setTitle('API REST for inventario')
    .setDescription('Esto es un api para manejo de policias')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('users')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,         // <── IMPORTANTE
    transformOptions: {
      enableImplicitConversion: true, // <── CONVIERTE STRINGS A NÚMEROS
    },
  }),
);
  await app.listen(getConfig().PORT,'0.0.0.0');
}
bootstrap();
