import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ActivitiesModule } from './activities/activities.module';
import { DatabaseModule } from './database/database.module';
import { TagsModule } from './tags/tags.module';
import { TagNamesModule } from './tag-names/tag-names.module';
import { AutoTagsModule } from './auto-tags/auto-tags.module';
import { ActiveStatesModule } from './activeStates/active-states.module';
import { ScheduleModule } from '@nestjs/schedule';
import { WebsitesModule } from './websites/websites.module';
import { resolve } from 'node:path';
import fs from 'fs';
import { ServeStaticModule } from '@nestjs/serve-static';

let clientDistFolder: string;
if (fs.statSync(resolve('../client/dist/index.html'))) {
  clientDistFolder = resolve('../dist/client');
} else {
  clientDistFolder = resolve('../../dist/client');
}

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: clientDistFolder,
    }),
    ScheduleModule.forRoot(),
    ActivitiesModule,
    ActiveStatesModule,
    DatabaseModule,
    TagsModule,
    TagNamesModule,
    AutoTagsModule,
    WebsitesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
