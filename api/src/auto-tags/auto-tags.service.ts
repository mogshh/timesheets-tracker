import { CreateAutoTagDto } from './dto/create-auto-tag.dto';
import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { v4 as uuid } from 'uuid';
import type { AutoTag } from '../types/types';
import { unflatten } from 'nested-objects-util';
import { UpdateAutoTagsDto } from './dto/update-auto-tags.dto';

@Injectable()
export class AutoTagsService {
  private selectList = [
    'autoTags.id',
    'autoTags.name',
    'autoTags.tagNameId',
    'autoTags.priority',
    'autoTags.conditions',
    'tagNames.id as tagName.id',
    'tagNames.name as tagName.name',
    'tagNames.color as tagName.color',
  ] as const;

  constructor(@Inject(DatabaseService) private databaseService: DatabaseService) {}

  adapt(rawAutoTag: Record<string, any>): AutoTag {
    return {
      ...unflatten(rawAutoTag),
      conditions: JSON.parse(rawAutoTag.conditions),
    };
  }

  async findAll(searchTerm: string | undefined): Promise<AutoTag[]> {
    let rawAutoTags: Record<string, string>[];
    if (searchTerm) {
      rawAutoTags = await this.databaseService.db
        .selectFrom('autoTags')
        .leftJoin('tagNames', 'tagNames.id', 'autoTags.tagNameId')
        .select(this.selectList)
        .where('name', 'like', '%' + searchTerm + '%')
        .execute();
    } else {
      rawAutoTags = await this.databaseService.db
        .selectFrom('autoTags')
        .leftJoin('tagNames', 'tagNames.id', 'autoTags.tagNameId')
        .select(this.selectList)
        .execute();
    }
    return rawAutoTags.map(this.adapt);
  }

  async count(): Promise<number> {
    const result = await this.databaseService.db
      .selectFrom('autoTags')
      .select(({ fn }) => [fn.count<number>('id').as('count')])
      .executeTakeFirstOrThrow();
    return result.count;
  }

  async findOne(id: string): Promise<AutoTag> {
    const autoTag = await this.databaseService.db
      .selectFrom('autoTags')
      .leftJoin('tagNames', 'tagNames.id', 'autoTags.tagNameId')
      .select(this.selectList)
      .where('autoTags.id', '=', id)
      .executeTakeFirstOrThrow();

    return this.adapt(autoTag);
  }

  async create(autoTag: CreateAutoTagDto): Promise<AutoTag> {
    const createdAutoTag = await this.databaseService.db
      .insertInto('autoTags')
      .values({
        id: uuid(),
        name: autoTag.name,
        tagNameId: autoTag.tagNameId,
        priority: autoTag.priority,
        conditions: JSON.stringify(autoTag.conditions),
      })
      .returning('id')
      .executeTakeFirstOrThrow();

    return await this.findOne(createdAutoTag.id); // is already adapted
  }

  async update(id: string, updateAutoTagDto: UpdateAutoTagsDto): Promise<AutoTag> {
    const result = await this.databaseService.db
      .updateTable('autoTags')
      .set({ ...updateAutoTagDto, conditions: JSON.stringify(updateAutoTagDto.conditions) })
      .where('id', '=', id)
      .returning('id')
      .executeTakeFirstOrThrow();

    return await this.findOne(result.id);
  }

  async delete(id: string) {
    await this.databaseService.db.deleteFrom('autoTags').where('id', '=', id).execute();
  }
}
