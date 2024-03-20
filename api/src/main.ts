import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import pkg from '../package.json';

const APP_TITLE = 'TimesheetsTracker';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle(APP_TITLE)
    .setDescription('API for manipulating activities and tagging them')
    .setVersion(pkg.version)
    .addServer('http://localhost:55577')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors();

  await app.listen(55577);
}

bootstrap();
