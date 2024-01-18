import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import type { ActiveState } from '../types/types';
import { DatabaseService } from '../database/database.service';
import ActiveWindow, { WindowInfo } from '@paymoapp/active-window';
import { v4 as uuid } from 'uuid';
import { differenceInSeconds, max, min } from 'date-fns';
import { CreateActiveStateDto } from './dto/create-active-state.dto';
import { unflatten } from 'nested-objects-util';
import { UpdateActiveStateDto } from './dto/update-active-state.dto';
import RealIdle from '@paymoapp/real-idle';

const MINIMUM_ACTIVITY_DURATION_SECONDS = 5;

@Injectable()
export class ActiveStatesService implements OnApplicationBootstrap {
  private activeWindowSubscriptionId: number;
  private lastActiveState: CreateActiveStateDto | null = null;
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

    this.startTrackingIdleTime();
  }

  async stopListening() {
    this.lastActiveState = null;
  }

  adapt(rawActiveState: Record<string, any>): ActiveState {
    return unflatten(rawActiveState) as ActiveState;
  }

  private startTrackingIdleTime() {
    setInterval(
      () => {
        const idleState = RealIdle.getIdleState(5 * 60 * 1000);
        const currentIsActiveState = {
          active: true,
          idlePrevented: true,
          idle: false,
          locked: false,
          unknown: false,
        }[idleState];
        const currentActiveState: CreateActiveStateDto = {
          active: currentIsActiveState,
          startedAt: new Date().toISOString();
        };

        if (!this.lastActiveState) {
          this.lastActiveState = currentIsActiveState;
        } else if (
          // If same program and title, ignore entry
          (this.lastActiveState.programName === currentIsActiveState.programName &&
            this.lastActiveState.windowTitle === currentIsActiveState.windowTitle) ||
          // If windows explorer en no title, ignore entry
          (currentIsActiveState.programName === 'Windows Explorer' &&
            currentIsActiveState.windowTitle === '')
        ) {
          // ignore entry since it's the same activeState as this.lastActiveState
        } else {
          // ActiveState changes, write last activeState to database
          console.log(
            'changed application or title: ',
            new Date().toISOString(),
            windowInfo?.application,
            windowInfo?.title
          );
          await this.create({
            programName: this.lastActiveState.programName,
            windowTitle: this.lastActiveState.windowTitle,
            startedAt: this.lastActiveState.startedAt,
            endedAt: currentIsActiveState.startedAt,
          });
          this.lastActiveState = currentIsActiveState;
        }
      },
      5 * 60 * 1000
    );
  }

  async findAll(startedAt: string, endedAt: string): Promise<ActiveState[]> {
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

  async findOne(id: string): Promise<ActiveState> {
    const result = await this.databaseService.db
      .selectFrom('activities')
      .select(this.selectList)
      .where('id', '>', id)
      .executeTakeFirstOrThrow();

    return this.adapt(result);
  }

  async create(activeState: CreateActiveStateDto): Promise<ActiveState> {
    const createdActiveState = await this.databaseService.db
      .insertInto('activities')
      .values({
        id: uuid(),
        programName: activeState.programName,
        windowTitle: activeState.windowTitle,
        startedAt: min([
          new Date(activeState.startedAt),
          new Date(activeState.endedAt),
        ]).toISOString(),
        endedAt: max([
          new Date(activeState.startedAt),
          new Date(activeState.endedAt),
        ]).toISOString(),
      })
      .returning(this.selectList)
      .execute();
    return this.adapt(createdActiveState);
  }

  async update(id: string, updateActiveStateDto: UpdateActiveStateDto): Promise<ActiveState> {
    const result = await this.databaseService.db
      .updateTable('activities')
      .set(updateActiveStateDto)
      .where('id', '=', id)
      .returning('id')
      .executeTakeFirstOrThrow();

    return this.findOne(result.id);
  }

  async delete(id: string): Promise<void> {
    await this.databaseService.db.deleteFrom('tagNames').where('id', '=', id).execute();
  }
}
