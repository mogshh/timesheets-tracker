import { Inject, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { DatabaseService } from '../database/database.service';
import { v4 as uuid } from 'uuid';
import { Tag } from '../types/types';
import { unflatten } from 'nested-objects-util';
import { max, min } from 'date-fns';

@Injectable()
export class TagsService {
  constructor(@Inject(DatabaseService) private databaseService: DatabaseService) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const newTag = await this.databaseService.db
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
      .returning(['tags.id'])
      .executeTakeFirstOrThrow();
    return this.findOne(newTag.id);
  }

  async findAll(startedAt: string, endedAt: string): Promise<Tag[]> {
    const rawTags = await this.databaseService.db
      .selectFrom('tags')
      .leftJoin('tagNames', 'tagNames.id', 'tags.tagNameId')
      .select([
        'tags.id',
        'tags.tagNameId',
        'tags.startedAt',
        'tags.endedAt',
        'tagNames.id as tagName.id',
        'tagNames.name as tagName.name',
        'tagNames.color as tagName.color',
      ])
      .where('startedAt', '>', startedAt)
      .where('endedAt', '<', endedAt)
      .execute();
    return rawTags.map((tag) => unflatten(tag));
  }

  async findOne(id: string): Promise<Tag> {
    const rawTag = await this.databaseService.db
      .selectFrom('tags')
      .leftJoin('tagNames', 'tagNames.id', 'tags.tagNameId')
      .select([
        'tags.id',
        'tags.tagNameId',
        'tags.startedAt',
        'tags.endedAt',
        'tagNames.id as tagName.id',
        'tagNames.name as tagName.name',
        'tagNames.color as tagName.color',
      ])
      .where('tags.id', '=', id)
      .executeTakeFirstOrThrow();
    return unflatten(rawTag);
  }

  // update(id: number, updateTagDto: UpdateTagDto) {
  //   return `This action updates a #${id} tag`;
  // }

  async remove(id: string): Promise<void> {
    await this.databaseService.db.deleteFrom('tags').where('id', '=', id).execute();
  }
}
