import { Inject, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { DatabaseService } from '../database/database.service';
import { v4 as uuid } from 'uuid';
import type { Tag } from '../types/types';
import { unflatten } from 'nested-objects-util';
import { max, min } from 'date-fns';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  private selectList = [
    'tags.id as id',
    'tags.tagNameId as tagNameId',
    'tags.startedAt as startedAt',
    'tags.endedAt as endedAt',
    'tagNames.id as tagName.id',
    'tagNames.name as tagName.name',
    'tagNames.color as tagName.color',
  ] as const;

  constructor(@Inject(DatabaseService) private databaseService: DatabaseService) {}

  private adapt(rawTag: Record<string, any>): Tag {
    return unflatten(rawTag);
  }

  async findAll(startedAt: string, endedAt: string): Promise<Tag[]> {
    const rawTags = await this.databaseService.db
      .selectFrom('tags')
      .leftJoin('tagNames', 'tagNames.id', 'tags.tagNameId')
      .select(this.selectList)
      .where('startedAt', '>', startedAt)
      .where('endedAt', '<', endedAt)
      .execute();

    return rawTags.map(this.adapt);
  }

  async findOne(id: string): Promise<Tag> {
    const rawTag = await this.databaseService.db
      .selectFrom('tags')
      .leftJoin('tagNames', 'tagNames.id', 'tags.tagNameId')
      .select(this.selectList)
      .where('tags.id', '=', id)
      .executeTakeFirstOrThrow();

    return this.adapt(rawTag);
  }

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const result = await this.databaseService.db
      .insertInto('tags')
      .values({
        id: uuid(),
        tagNameId: createTagDto.tagNameId,
        startedAt: min([
          new Date(createTagDto.startedAt),
          new Date(createTagDto.endedAt),
        ]).toISOString(),
        endedAt: max([
          new Date(createTagDto.startedAt),
          new Date(createTagDto.endedAt),
        ]).toISOString(),
      })
      .returning('id')
      .executeTakeFirstOrThrow();

    return this.findOne(result.id);
  }

  async update(id: string, updateTagDto: UpdateTagDto): Promise<Tag> {
    const result = await this.databaseService.db
      .selectFrom('tags')
      .select('id')
      .where('id', '=', id)
      .executeTakeFirstOrThrow();

    return await this.findOne(result.id);
  }

  async remove(id: string): Promise<void> {
    await this.databaseService.db.deleteFrom('tags').where('id', '=', id).execute();
  }
}
