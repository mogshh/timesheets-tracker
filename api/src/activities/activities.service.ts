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
export class ActivitiesService implements OnApplicationBootstrap {
  private activeWindowSubscriptionId: number;
  private lastActivity: CreateActivityDto | null = null;
  private selectList: string[] = ['id', 'programName', 'windowTitle', 'startedAt', 'endedAt'];

  constructor(@Inject(DatabaseService) private databaseService: DatabaseService) {}

  async onApplicationBootstrap() {
    await this.startListening();
  }

  async startListening() {
    ActiveWindow.initialize();

    if (!ActiveWindow.requestPermissions()) {
      console.error(
        'Error: You need to grant screen recording permission in System Preferences > Security & Privacy > Privacy > Screen Recording'
      );
      process.exit(0);
    }

    this.activeWindowSubscriptionId = ActiveWindow.subscribe(
      async (windowInfo: WindowInfo | null) => {
        if (!windowInfo) {
          return;
        }
        const currentActivity: CreateActivityDto = {
          programName: windowInfo.application,
          windowTitle: windowInfo.title,
          startedAt: new Date().toISOString(),
          endedAt: new Date().toISOString(),
        };

        if (!this.lastActivity) {
          this.lastActivity = currentActivity;
        } else if (
          // If same program and title, ignore entry
          (this.lastActivity.programName === currentActivity.programName &&
            this.lastActivity.windowTitle === currentActivity.windowTitle) ||
          // If windows explorer en no title, ignore entry
          (currentActivity.programName === 'Windows Explorer' && currentActivity.windowTitle === '')
        ) {
          // ignore entry since it's the same activity as this.lastActivity
        } else {
          // Activity changes, write last activity to database
          console.log(
            'changed application or title: ',
            new Date().toISOString(),
            windowInfo?.application,
            windowInfo?.title
          );
          await this.create({
            programName: this.lastActivity.programName,
            windowTitle: this.lastActivity.windowTitle,
            startedAt: this.lastActivity.startedAt,
            endedAt: currentActivity.startedAt,
          });
          this.lastActivity = currentActivity;
        }
      }
    );
  }

  async stopListening() {
    ActiveWindow.unsubscribe(this.activeWindowSubscriptionId);
    this.lastActivity = null;
  }

  adapt(rawActivity: Record<string, any>): Activity {
    return unflatten(rawActivity) as Activity;
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
      .where('id', '>', id)
      .executeTakeFirstOrThrow();
    return this.adapt(result);
  }

  async update(id: string, updateActivityDto: UpdateActivityDto): Promise<Activity> {
    const result = await this.databaseService.db
      .updateTable('activities')
      .set(updateActivityDto)
      .where('id', '=', id)
      .returning(this.selectList)
      .execute();
    return this.adapt(result);
  }

  async delete(id: string): Promise<void> {
    await this.databaseService.db.deleteFrom('tagNames').where('id', '=', id).execute();
  }
}
