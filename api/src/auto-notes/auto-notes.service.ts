import { CreateAutoNoteDto } from './dto/create-auto-note.dto';
import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { v4 as uuid } from 'uuid';
import type { AutoNote } from '../types/types';
import { UpdateAutoNoteDto } from './dto/update-auto-note.dto';

const TAG_NAME_IDS_SEPARATOR = ';';

@Injectable()
export class AutoNotesService {
  private selectList: (keyof AutoNote)[] = [
    'id',
    'name',
    'tagNameIds',
    'variable',
    'extractRegex',
    'extractRegexReplacement',
  ];
  constructor(@Inject(DatabaseService) private databaseService: DatabaseService) {}

  private adapt(rawAutoNote: Record<string, any>): AutoNote {
    return {
      id: rawAutoNote.id,
      name: rawAutoNote.name,
      tagNameIds: rawAutoNote.tagNameIds.split(TAG_NAME_IDS_SEPARATOR),
      variable: rawAutoNote.variable,
      extractRegex: rawAutoNote.extractRegex,
      extractRegexReplacement: rawAutoNote.extractRegexReplacement,
    };
  }

  async findAll(searchTerm: string | undefined): Promise<AutoNote[]> {
    let rawAutoNotes: Record<string, string>[];
    if (searchTerm) {
      rawAutoNotes = await this.databaseService.db
        .selectFrom('autoNotes')
        .select(this.selectList)
        .where('name', 'like', '%' + searchTerm + '%')
        .execute();
    } else {
      rawAutoNotes = await this.databaseService.db
        .selectFrom('autoNotes')
        .select(this.selectList)
        .execute();
    }

    return rawAutoNotes.map(this.adapt);
  }

  async count(): Promise<number> {
    const result = await this.databaseService.db
      .selectFrom('autoNotes')
      .select(({ fn }) => [fn.count<number>('id').as('count')])
      .executeTakeFirstOrThrow();

    return result.count;
  }

  async findOne(id: string): Promise<AutoNote> {
    const result = await this.databaseService.db
      .selectFrom('autoNotes')
      .select(this.selectList)
      .where('id', '=', id)
      .executeTakeFirstOrThrow();

    return this.adapt(result);
  }

  async create(autoNote: CreateAutoNoteDto): Promise<AutoNote> {
    const result = await this.databaseService.db
      .insertInto('autoNotes')
      .values({
        id: uuid(),
        name: autoNote.name,
        tagNameIds: autoNote.tagNameIds.join(TAG_NAME_IDS_SEPARATOR),
        variable: autoNote.variable,
        extractRegex: autoNote.extractRegex,
        extractRegexReplacement: autoNote.extractRegexReplacement,
      })
      .returning('id')
      .executeTakeFirstOrThrow();

    return await this.findOne(result.id);
  }

  async update(id: string, updateTagDto: UpdateAutoNoteDto): Promise<AutoNote> {
    const result = await this.databaseService.db
      .updateTable('autoNotes')
      .set({
        name: updateTagDto.name,
        tagNameIds: updateTagDto.tagNameIds.join(TAG_NAME_IDS_SEPARATOR),
        variable: updateTagDto.variable,
        extractRegex: updateTagDto.extractRegex,
        extractRegexReplacement: updateTagDto.extractRegexReplacement,
      })
      .where('id', '=', id)
      .returning('id')
      .executeTakeFirstOrThrow();

    return await this.findOne(result.id);
  }

  async remove(id: string): Promise<void> {
    await this.databaseService.db.deleteFrom('autoNotes').where('id', '=', id).execute();
  }
}
