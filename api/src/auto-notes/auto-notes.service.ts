import { CreateAutoNoteDto } from './dto/create-auto-note.dto';
import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { v4 as uuid } from 'uuid';
import type { AutoNote } from '../types/types';
import { UpdateAutoNoteDto } from './dto/update-auto-note.dto';

const TAG_NAME_IDS_SEPARATOR = ';';

@Injectable()
export class AutoNotesService {
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
    let rawAutoNotes: AutoNote[];
    if (searchTerm) {
      rawAutoNotes = await this.databaseService.exec<AutoNote>(
        './queries/findAllAutoNotesBySearchTerm'
      );
    } else {
      rawAutoNotes = await this.databaseService.exec<AutoNote>('./queries/findAllAutoNotes');
    }

    return rawAutoNotes.map(this.adapt);
  }

  async count(): Promise<number> {
    const result = (
      await this.databaseService.exec<{ count: number }>('./queries/countAutoNotes')
    )[0];

    return result.count;
  }

  async findOne(id: string): Promise<AutoNote> {
    const result = await this.databaseService.exec('./queries/findOneAutoNote', { id });

    return this.adapt(result);
  }

  async create(autoNote: CreateAutoNoteDto): Promise<AutoNote> {
    const values = {
      id: uuid(),
      name: autoNote.name,
      tagNameIds: autoNote.tagNameIds.join(TAG_NAME_IDS_SEPARATOR),
      variable: autoNote.variable,
      extractRegex: autoNote.extractRegex,
      extractRegexReplacement: autoNote.extractRegexReplacement,
    };
    await this.databaseService.exec('./queries/createAutoNote', values);

    return this.findOne(values.id);
  }

  async update(id: string, updateTagDto: UpdateAutoNoteDto): Promise<AutoNote> {
    const values = {
      id,
      name: updateTagDto.name,
      tagNameIds: updateTagDto.tagNameIds.join(TAG_NAME_IDS_SEPARATOR),
      variable: updateTagDto.variable,
      extractRegex: updateTagDto.extractRegex,
      extractRegexReplacement: updateTagDto.extractRegexReplacement,
    };
    await this.databaseService.exec('./queries/updateAutoNote');

    return await this.findOne(values.id);
  }

  async remove(id: string): Promise<void> {
    await this.databaseService.exec('./queries/deleteAutoNote', { id });
  }
}
