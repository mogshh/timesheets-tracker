import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { DatabaseModule } from '../database/database.module';
import { ActivitiesListener } from './activities.listener';

@Module({
  imports: [DatabaseModule],
  controllers: [ActivitiesController],
  providers: [ActivitiesService, ActivitiesListener],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
