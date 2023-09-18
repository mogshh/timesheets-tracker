import { CreateAutoTagDto } from './dto/create-auto-tag.dto';
import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { v4 as uuid } from 'uuid';
import { AutoTag, TagName } from '../types/types';

@Injectable()
export class AutoTagsService {
  constructor(@Inject(DatabaseService) private databaseService: DatabaseService) {}

  async create(autoTag: CreateAutoTagDto): Promise<AutoTag> {
    const createdAutoTag = await this.databaseService.db
      .insertInto('autoTags')
      .values({
        id: uuid(),
        tagNameId: autoTag.tagNameId,
        priority: autoTag.priority,
        conditions: JSON.stringify(autoTag.conditions),
      })
      .returning(['id', 'tagNameId', 'priority', 'conditions'])
      .executeTakeFirstOrThrow();
    return {
      id: createdAutoTag.id,
      tagNameId: createdAutoTag.tagNameId,
      priority: createdAutoTag.priority,
      conditions: JSON.parse(createdAutoTag.conditions),
    };
  }

  async findAll(searchTerm: string | undefined): Promise<TagName[]> {
    return this.databaseService.db
      .selectFrom('tagNames')
      .selectAll()
      .where('name', 'like', '%' + searchTerm + '%')
      .execute();
  }

  async count(): Promise<number> {
    const result = await this.databaseService.db
      .selectFrom('tagNames')
      .select(({ fn }) => [fn.count<number>('id').as('count')])
      .executeTakeFirstOrThrow();
    return result.count;
  }

  findOne(id: string) {
    return this.databaseService.db
      .selectFrom('autoTags')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
  }
  //
  // update(id: number, updateTagDto: UpdateTagDto) {
  //   return `This action updates a #${id} tag`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} tag`;
  // }
}
