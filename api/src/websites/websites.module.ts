import { Module } from '@nestjs/common';
import { WebsitesService } from './websites.service';
import { WebsitesController } from './websites.controller';
import { DatabaseModule } from '../database/database.module';
import { ActivitiesModule } from '../activities/activities.module';

@Module({
  imports: [DatabaseModule, ActivitiesModule],
  controllers: [WebsitesController],
  providers: [WebsitesService],
})
export class WebsitesModule {}
