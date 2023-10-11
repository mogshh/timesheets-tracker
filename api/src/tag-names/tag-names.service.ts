import { CreateTagNameDto } from './dto/create-tag-name.dto';
import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { v4 as uuid } from 'uuid';
import type { TagName } from '../types/types';

@Injectable()
export class TagNamesService {
  constructor(@Inject(DatabaseService) private databaseService: DatabaseService) {}

  async create(tagName: CreateTagNameDto): Promise<TagName> {
    return this.databaseService.db
      .insertInto('tagNames')
      .values({
        id: uuid(),
        name: tagName.name,
        color: tagName.color,
      })
      .returning(['id', 'name', 'color'])
      .executeTakeFirstOrThrow();
  }

  async findAll(searchTerm: string | undefined): Promise<TagName[]> {
    return this.databaseService.db
      .selectFrom('tagNames')
      .select(['id', 'name', 'color'])
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
      .selectFrom('tagNames')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
  }

  // update(id: number, updateTagDto: UpdateTagDto) {
  //   return `This action updates a #${id} tag`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} tag`;
  // }
}
