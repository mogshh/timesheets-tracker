import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import type { Activity } from '../types/types';
import { DatabaseService } from '../database/database.service';
import ActiveWindow, { WindowInfo } from '@paymoapp/active-window';
import { v4 as uuid } from 'uuid';
import { differenceInSeconds, max, min } from 'date-fns';
import { CreateActivityDto } from './dto/create-activity.dto';
import { unflatten } from 'nested-objects-util';
import { UpdateActivityDto } from './dto/update-activity.dto';

const MINIMUM_ACTIVITY_DURATION_SECONDS = 5;

@Injectable()
export class ActivitiesService {
  private selectList: (keyof Activity)[] = [
    'id',
    'programName',
    'windowTitle',
    'startedAt',
    'endedAt',
  ];

  constructor(@Inject(DatabaseService) private databaseService: DatabaseService) {}

  adapt(rawActivity: Record<string, any>): Activity {
    return unflatten(rawActivity) as Activity;
  }

  async findAll(startedAt: string, endedAt: string): Promise<Activity[]> {
    const results = await this.databaseService.db
      .selectFrom('activities')
      .select(this.selectList)
      .where('activities.startedAt', '>', startedAt)
      .where('activities.endedAt', '<', endedAt)
      .execute();
    const realResults = results.filter((result) => {
      const diff = differenceInSeconds(new Date(result.endedAt), new Date(result.startedAt));
      return diff > MINIMUM_ACTIVITY_DURATION_SECONDS;
    });
    return realResults.map(this.adapt);
  }

  async findOne(id: string): Promise<Activity> {
    const result = await this.databaseService.db
      .selectFrom('activities')
      .select(this.selectList)
      .where('id', '=', id)
      .executeTakeFirstOrThrow();

    return this.adapt(result);
  }

  async findByNextStartedAt(startedAt: string): Promise<Activity> {
    const result = await this.databaseService.db
      .selectFrom('activities')
      .select(this.selectList)
      .where('startedAt', '>', startedAt)
      .orderBy('startedAt', 'asc')
      .limit(1)
      .executeTakeFirstOrThrow();

    return this.adapt(result);
  }

  async create(activity: CreateActivityDto): Promise<Activity> {
    const createdActivity = await this.databaseService.db
      .insertInto('activities')
      .values({
        id: uuid(),
        programName: activity.programName,
        windowTitle: activity.windowTitle,
        startedAt: min([new Date(activity.startedAt), new Date(activity.endedAt)]).toISOString(),
        endedAt: max([new Date(activity.startedAt), new Date(activity.endedAt)]).toISOString(),
      })
      .returning(this.selectList)
      .execute();
    return this.adapt(createdActivity);
  }

  // async update(id: string, updateActivityDto: UpdateActivityDto): Promise<Activity> {
  //   const result = await this.databaseService.db
  //     .updateTable('activities')
  //     .set(updateActivityDto)
  //     .where('id', '=', id)
  //     .returning('id')
  //     .executeTakeFirstOrThrow();
  //
  //   return await this.findOne(result.id);
  // }

  async delete(id: string): Promise<void> {
    await this.databaseService.db.deleteFrom('activities').where('id', '=', id).execute();
  }
}
