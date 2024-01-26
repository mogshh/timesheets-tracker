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

@Module({
  imports: [
    ActivitiesModule,
    ActiveStatesModule,
    DatabaseModule,
    TagsModule,
    TagNamesModule,
    AutoTagsModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
