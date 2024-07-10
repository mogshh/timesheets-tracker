import { Inject, Injectable } from '@nestjs/common';
import type { Activity } from '../types/types';
import { DatabaseService } from '../database/database.service';
import { v4 as uuid } from 'uuid';
import { differenceInSeconds, max, min } from 'date-fns';
import { CreateActivityDto } from './dto/create-activity.dto';
import { unflatten } from 'nested-objects-util';

const MINIMUM_ACTIVITY_DURATION_SECONDS = 5;

@Injectable()
export class ActivitiesService {
  constructor(@Inject(DatabaseService) private databaseService: DatabaseService) {}

  adapt(rawActivity: Record<string, any>): Activity {
    return unflatten(rawActivity) as Activity;
  }

  async findAll(startedAt: string, endedAt: string): Promise<Activity[]> {
    const results = await this.databaseService.exec<Activity>('./queries/findAllActivities.sql', {
      startedAt,
      endedAt,
    });

    const realResults = results.filter((result: Activity) => {
      const diff = differenceInSeconds(new Date(result.endedAt), new Date(result.startedAt));
      return diff > MINIMUM_ACTIVITY_DURATION_SECONDS;
    });
    return realResults.map(this.adapt);
  }

  async findOne(id: string): Promise<Activity> {
    const result = await this.databaseService.exec('./queries/findOneActivity.sql', { id });

    return this.adapt(result);
  }

  async findByNextStartedAt(startedAt: string): Promise<Activity> {
    const result = await this.databaseService.exec('./queries/findByNextStartedAt.sql', {
      startedAt,
    });

    return this.adapt(result);
  }

  async create(activity: CreateActivityDto): Promise<Activity> {
    const createdActivity = await this.databaseService.exec('./queries/createActivity.sql', {
      id: uuid(),
      programName: activity.programName,
      windowTitle: activity.windowTitle,
      startedAt: min([new Date(activity.startedAt), new Date(activity.endedAt)]).toISOString(),
      endedAt: max([new Date(activity.startedAt), new Date(activity.endedAt)]).toISOString(),
    });

    return this.adapt(createdActivity);
  }

  // async update(id: string, updateActivityDto: UpdateActivityDto): Promise<Activity> {
  //   await this.databaseService.exec('./queries/updateActivity.sql', {
  //     id,
  //     programName: updateActivityDto.programName,
  //     windowTitle: updateActivityDto.windowTitle,
  //     startedAt: min([
  //       new Date(updateActivityDto.startedAt),
  //       new Date(updateActivityDto.endedAt),
  //     ]).toISOString(),
  //     endedAt: max([
  //       new Date(updateActivityDto.startedAt),
  //       new Date(updateActivityDto.endedAt),
  //     ]).toISOString(),
  //   });
  //
  //   return this.findOne(id);
  // }

  async delete(id: string): Promise<void> {
    await this.databaseService.exec('./queries/deleteActivity.sql', { id });
  }
}
