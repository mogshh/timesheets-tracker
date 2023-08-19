import { CreateTagNameDto } from './dto/create-tag-name.dto';
import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { v4 as uuid } from 'uuid';
import { TagName } from '../types/types';

@Injectable()
export class TagNamesService {
  constructor(@Inject(DatabaseService) private databaseService: DatabaseService) {}

  async create(tagName: CreateTagNameDto): Promise<void> {
    await this.databaseService.db
      .insertInto('tagNames')
      .values({
        id: uuid(),
        name: tagName.name,
        color: tagName.color,
      })
      .execute();
  }

  async findAll(searchTerm: string | undefined): Promise<TagName[]> {
    return this.databaseService.db
      .selectFrom('tagNames')
      .selectAll()
      .where('name', 'like', '%' + searchTerm + '%')
      .execute();
  }

  //
  // findOne(id: number) {
  //   return `This action returns a #${id} tag`;
  // }
  //
  // update(id: number, updateTagDto: UpdateTagDto) {
  //   return `This action updates a #${id} tag`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} tag`;
  // }
}
