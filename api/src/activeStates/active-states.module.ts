import { Module } from '@nestjs/common';
import { ActiveStatesService } from './active-states.service';
import { ActiveStatesController } from './active-states.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ActiveStatesController],
  providers: [ActiveStatesService],
})
export class ActiveStatesModule {}
