import { Inject, Injectable } from '@nestjs/common';
import type { Website } from '../types/types';
import { DatabaseService } from '../database/database.service';
import { v4 as uuid } from 'uuid';
import { CreateWebsiteDto } from './dto/create-website.dto';
import { unflatten } from 'nested-objects-util';
import { UpdateWebsiteDto } from './dto/update-website.dto';

@Injectable()
export class WebsitesService {
  private selectList: (keyof Website)[] = ['id', 'websiteTitle', 'websiteUrl', 'startedAt'];

  constructor(@Inject(DatabaseService) private databaseService: DatabaseService) {}

  adapt(rawWebsite: Record<string, any>): Website {
    return unflatten(rawWebsite) as Website;
  }

  async findAll(startedAt: string, endedAt: string): Promise<Website[]> {
    const results = await this.databaseService.db
      .selectFrom('websites')
      .select(this.selectList)
      .where('websites.startedAt', '>', startedAt)
      .where('websites.startedAt', '<', endedAt)
      .execute();
    return results.map(this.adapt);
  }

  async findOne(id: string): Promise<Website> {
    const result = await this.databaseService.db
      .selectFrom('websites')
      .select(this.selectList)
      .where('id', '=', id)
      .executeTakeFirstOrThrow();

    return this.adapt(result);
  }

  async create(website: CreateWebsiteDto): Promise<Website> {
    const createdWebsite = await this.databaseService.db
      .insertInto('websites')
      .values({
        id: uuid(),
        websiteTitle: website.websiteTitle,
        websiteUrl: website.websiteUrl,
        startedAt: website.startedAt,
      })
      .returning(this.selectList)
      .execute();
    return this.adapt(createdWebsite);
  }

  async update(id: string, updateWebsiteDto: UpdateWebsiteDto): Promise<Website> {
    const result = await this.databaseService.db
      .updateTable('websites')
      .set(updateWebsiteDto)
      .where('id', '=', id)
      .returning('id')
      .executeTakeFirstOrThrow();

    return await this.findOne(result.id);
  }

  async delete(id: string): Promise<void> {
    await this.databaseService.db.deleteFrom('websites').where('id', '=', id).execute();
  }
}
