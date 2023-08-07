import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import SysTray from 'systray';
import { iconIcoDataUri } from './icon';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import pkg from '../package.json';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder().setTitle('Timesheets Tracker').setDescription('API for manipulating activities and tagging them').setVersion(pkg.version).build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors();

  await app.listen(55577);
}

const systray = new SysTray({
  menu: {
    // you should use .png icon in macOS/Linux, but .ico format in windows
    icon: iconIcoDataUri,
    title: 'Timesheets Tracker',
    tooltip: 'Timesheets Tracker',
    items: [
      {
        title: 'Open UI',
        tooltip: 'Open the interface to tag applications',
        checked: false,
        enabled: true,
      },
      {
        title: 'Exit',
        tooltip: 'Stop tracking applications',
        checked: false,
        enabled: true,
      },
    ],
  },
  debug: false,
  copyDir: true, // copy go tray binary to outside directory, useful for packing tool like pkg.
});

systray.onClick((action) => {
  if (action.seq_id === 0) {
    // open the pwa
    console.log('open the url', action);
  } else if (action.seq_id === 1) {
    systray.kill();
  }
});

bootstrap();
