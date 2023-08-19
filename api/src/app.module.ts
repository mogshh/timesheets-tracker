import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ActivitiesModule } from './activities/activities.module';
import { DatabaseModule } from './database/database.module';
import { TagsModule } from './tags/tags.module';
import { TagNamesModule } from './tag-names/tag-names.module';

@Module({
  imports: [ActivitiesModule, DatabaseModule, TagsModule, TagNamesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
