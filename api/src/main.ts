import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import SysTray from 'systray';
import { iconIcoDataUri } from './icon';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import open from 'open';
import pkg from '../package.json';
import startupManager from 'node-startup-manager';
import * as path from 'path';

const APP_TITLE = 'TimesheetsTracker';

enum SystemTrayActionId {
  OpenUi,
  StartOnBoot,
  Quit,
}

const SYSTEM_TRAY_CONFIG = {
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
        title: 'Start on system boot',
        tooltip: 'Start timesheet tracker when you start-up your device',
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
};

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

async function addToStartupPrograms(): Promise<void> {
  try {
    const opts = {
      path: process.execPath,
      name: APP_TITLE,
      arguments: [path.normalize('../dist/src/main.js')],
    };

    await startupManager.add(opts);
    console.log('added to startup');
  } catch (err) {
    console.error('Failed to add program to the startup programs');
  }
}

async function removeFromStartupPrograms(): Promise<void> {
  try {
    await startupManager.remove(APP_TITLE);
    console.log('removed from startup');
  } catch (err) {
    console.error('Failed to remove program from startup programs');
  }
}

async function isInStartupPrograms(): Promise<boolean> {
  try {
    return startupManager.check(APP_TITLE);
  } catch (err) {
    console.error('Failed to remove program from startup programs');
  }
}

function setStartOnBoot(systray: SysTray, checked: boolean) {
  systray.sendAction({
    type: 'update-item',
    item: {
      title: 'Start on system boot',
      tooltip: 'Start timesheet tracker when you start-up your device',
      checked: checked,
      enabled: true,
    },
    seq_id: SystemTrayActionId.StartOnBoot,
  });
}

async function setupSystemTray() {
  const systray = new SysTray(SYSTEM_TRAY_CONFIG);

  systray.onClick(async (action) => {
    if (action.seq_id === SystemTrayActionId.OpenUi) {
      // open the pwa
      open('http://localhost:55588');
    } else if (action.seq_id === SystemTrayActionId.StartOnBoot) {
      if (await isInStartupPrograms()) {
        await removeFromStartupPrograms();
        setStartOnBoot(systray, false);
      } else {
        await addToStartupPrograms();
        setStartOnBoot(systray, true);
      }
    } else if (action.seq_id === SystemTrayActionId.Quit) {
      systray.kill();
      process.exit(0);
    }
  });

  setStartOnBoot(systray, await isInStartupPrograms());
}

setInterval(() => 'still running', 1000);

setupSystemTray();
bootstrap();
