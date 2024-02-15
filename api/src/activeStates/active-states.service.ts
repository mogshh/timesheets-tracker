import { Inject, Injectable } from '@nestjs/common';
import type { ActiveState } from '../types/types';
import { DatabaseService } from '../database/database.service';
import { v4 as uuid } from 'uuid';
import { CreateActiveStateDto } from './dto/create-active-state.dto';
import { unflatten } from 'nested-objects-util';
import { UpdateActiveStateDto } from './dto/update-active-state.dto';
import { CustomError } from '../shared/CustomError';

@Injectable()
export class ActiveStatesService {
  private selectList: (keyof ActiveState)[] = ['id', 'isActive', 'startedAt', 'endedAt'];

  constructor(@Inject(DatabaseService) private databaseService: DatabaseService) {}

  adapt(rawActiveState: Record<string, any> | null | undefined): ActiveState | null {
    if (!rawActiveState) {
      return null;
    }
    const unflattenedActiveState = unflatten(rawActiveState) as ActiveState;
    unflattenedActiveState.isActive = (unflattenedActiveState.isActive as unknown as 1 | 0) === 1;
    return unflattenedActiveState;
  }

  async findAll(startedAt: string, endedAt: string): Promise<ActiveState[]> {
    const results = await this.databaseService.db
      .selectFrom('activeStates')
      .select(this.selectList)
      .where('activeStates.startedAt', '>', startedAt)
      .where('activeStates.endedAt', '<', endedAt)
      .execute();
    return results.map(this.adapt);
  }

  async findOne(id: string): Promise<ActiveState> {
    try {
      const result = await this.databaseService.db
        .selectFrom('activeStates')
        .select(this.selectList)
        .where('id', '=', id)
        .executeTakeFirst();

      return this.adapt(result);
    } catch (err) {
      throw new CustomError('Failed to fetch one activeState entry from the database', err, { id });
    }
  }

  async create(activeState: CreateActiveStateDto): Promise<ActiveState> {
    try {
      const values = {
        id: uuid(),
        isActive: activeState.isActive ? 1 : 0,
        startedAt: activeState.startedAt,
        endedAt: activeState.endedAt,
      };
      const createdActiveState = await this.databaseService.db
        .insertInto('activeStates')
        .values(values)
        .returning(this.selectList)
        .executeTakeFirstOrThrow();
      return this.adapt(createdActiveState);
    } catch (err) {
      throw new CustomError('failed to create active state entry in the database', err, {
        activeState,
      });
    }
  }

  async update(id: string, updateActiveStateDto: UpdateActiveStateDto): Promise<ActiveState> {
    await this.databaseService.db
      .updateTable('activeStates')
      .set({
        isActive: updateActiveStateDto.isActive ? 1 : 0,
        startedAt: updateActiveStateDto.startedAt,
        endedAt: updateActiveStateDto.endedAt,
      })
      .where('id', '=', id)
      .returning('id')
      .executeTakeFirstOrThrow();

    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    await this.databaseService.db.deleteFrom('activeStates').where('id', '=', id).execute();
  }
}
