import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ActivitiesModule } from './activities/activities.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ActivitiesModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
