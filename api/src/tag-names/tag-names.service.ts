import { CreateTagNameDto } from './dto/create-tag-name.dto';
import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { v4 as uuid } from 'uuid';
import type { TagName } from '../types/types';
import { UpdateTagDto } from '../tags/dto/update-tag.dto';
import { UpdateTagNameDto } from './dto/update-tag-name.dto';

@Injectable()
export class TagNamesService {
  private selectList: string[] = ['id', 'name', 'color'];
  constructor(@Inject(DatabaseService) private databaseService: DatabaseService) {}

  private adapt(rawTagName: Record<string, any>): TagName {
    return {
      id: rawTagName.id,
      name: rawTagName.name,
      color: rawTagName.color,
    };
  }

  async findAll(searchTerm: string | undefined): Promise<TagName[]> {
    let rawTagNames: Record<string, string>[];
    if (searchTerm) {
      rawTagNames = await this.databaseService.db
        .selectFrom('tagNames')
        .select(this.selectList)
        .where('name', 'like', '%' + searchTerm + '%')
        .execute();
    } else {
      rawTagNames = await this.databaseService.db
        .selectFrom('tagNames')
        .select(this.selectList)
        .execute();
    }

    return rawTagNames.map(this.adapt);
  }

  async count(): Promise<number> {
    const result = await this.databaseService.db
      .selectFrom('tagNames')
      .select(({ fn }) => [fn.count<number>('id').as('count')])
      .executeTakeFirstOrThrow();

    return result.count;
  }

  async findOne(id: string): Promise<TagName> {
    const result = await this.databaseService.db
      .selectFrom('tagNames')
      .select(this.selectList)
      .where('id', '=', id)
      .executeTakeFirstOrThrow();

    return this.adapt(result);
  }

  async create(tagName: CreateTagNameDto): Promise<TagName> {
    const result = await this.databaseService.db
      .insertInto('tagNames')
      .values({
        id: uuid(),
        name: tagName.name,
        color: tagName.color,
      })
      .returning('id')
      .executeTakeFirstOrThrow();

    return this.adapt(await this.findOne(result.id));
  }

  async update(id: string, updateTagDto: UpdateTagNameDto): Promise<TagName> {
    const result = await this.databaseService.db
      .updateTable('tagNames')
      .set(updateTagDto)
      .where('id', '=', id)
      .returning('id')
      .executeTakeFirstOrThrow();

    return this.adapt(await this.findOne(result.id));
  }

  async remove(id: string): Promise<void> {
    await this.databaseService.db.deleteFrom('tagNames').where('id', '=', id).execute();
  }
}
