import { Inject, Injectable } from '@nestjs/common';
import type { Website } from '../types/types';
import { DatabaseService } from '../database/database.service';
import { v4 as uuid } from 'uuid';
import { CreateWebsiteDto } from './dto/create-website.dto';
import { unflatten } from 'nested-objects-util';
import { UpdateWebsiteDto } from './dto/update-website.dto';

@Injectable()
export class WebsitesService {
  constructor(@Inject(DatabaseService) private databaseService: DatabaseService) {}

  adapt(rawWebsite: Record<string, any>): Website {
    return unflatten(rawWebsite) as Website;
  }

  async findAll(startedAt: string, endedAt: string): Promise<Website[]> {
    const results = await this.databaseService.exec('queries/findAllWebsites.sql', {
      startedAt,
      endedAt,
    });

    return results.map(this.adapt);
  }

  async findOne(id: string): Promise<Website> {
    const result = await this.databaseService.exec('queries/findOneWebsite.sql', { id });

    return this.adapt(result);
  }

  async findOneByStartTime(startedAt: string): Promise<Website | null> {
    const result = await this.databaseService.exec('queries/findOneWebsiteByStartTime.sql', {
      startedAt,
    });

    if (!result) {
      return null;
    }

    return this.adapt(result);
  }

  async create(website: CreateWebsiteDto): Promise<Website> {
    const values = {
      id: uuid(),
      websiteTitle: website.websiteTitle,
      websiteUrl: website.websiteUrl,
      startedAt: website.startedAt,
    };
    await this.databaseService.exec('queries/createWebsite.sql', values);

    return this.findOne(values.id);
  }

  async update(id: string, updateWebsiteDto: UpdateWebsiteDto): Promise<Website> {
    const values: Website = {
      id,
      websiteTitle: updateWebsiteDto.websiteTitle,
      websiteUrl: updateWebsiteDto.websiteUrl,
      startedAt: updateWebsiteDto.startedAt,
    };
    await this.databaseService.exec('queries/updateWebsite.sql', values);

    return await this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    await this.databaseService.exec('queries/deleteWebsite.sql', { id });
  }
}
