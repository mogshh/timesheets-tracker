import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Activity } from '../types/types';
import { DatabaseService } from '../database/database.service';
import ActiveWindow, { WindowInfo } from '@paymoapp/active-window';
import { v4 as uuid } from 'uuid';
import { differenceInSeconds, max, min } from 'date-fns';

const MINIMUM_ACTIVITY_DURATION_SECONDS = 5;

@Injectable()
export class ActivitiesService implements OnApplicationBootstrap {
  private activeWindowSubscriptionId: number;
  private lastActivity: Activity | null = null;

  constructor(@Inject(DatabaseService) private databaseService: DatabaseService) {}

  async onApplicationBootstrap() {
    await this.startListening();
  }

  async startListening() {
    ActiveWindow.initialize();

    if (!ActiveWindow.requestPermissions()) {
      console.log(
        'Error: You need to grant screen recording permission in System Preferences > Security & Privacy > Privacy > Screen Recording'
      );
      process.exit(0);
    }

    this.activeWindowSubscriptionId = ActiveWindow.subscribe(
      async (windowInfo: WindowInfo | null) => {
        if (!windowInfo) {
          return;
        }
        const currentActivity: Activity = {
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

  async create(activity: Activity): Promise<void> {
    await this.databaseService.db
      .insertInto('activities')
      .values({
        id: uuid(),
        programName: activity.programName,
        windowTitle: activity.windowTitle,
        startedAt: min([new Date(activity.startedAt), new Date(activity.endedAt)]).toISOString(),
        endedAt: max([new Date(activity.startedAt), new Date(activity.endedAt)]).toISOString(),
      })
      .execute();
  }

  async findAll(startedAt: string, endedAt: string): Promise<Activity[]> {
    const results = await this.databaseService.db
      .selectFrom('activities')
      .selectAll()
      .where('activities.startedAt', '>', startedAt)
      .where('activities.endedAt', '<', endedAt)
      .execute();
    return results.filter((result) => {
      const diff = differenceInSeconds(new Date(result.endedAt), new Date(result.startedAt));
      return diff > MINIMUM_ACTIVITY_DURATION_SECONDS;
    });
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} activity`;
  // }
  //
  // update(id: number, updateActivityDto: UpdateActivityDto) {
  //   return `This action updates a #${id} activity`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} activity`;
  // }
}
