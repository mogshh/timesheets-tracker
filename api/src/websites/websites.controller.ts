import { Controller, Get, Post, Body, Query, Param, Patch, Delete } from '@nestjs/common';
import { WebsitesService } from './websites.service';
import type { Website } from '../types/types';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { endOfDay, startOfDay } from 'date-fns';
import { CreateWebsiteDto } from './dto/create-website.dto';

@ApiTags('websites')
@Controller('websites')
export class WebsitesController {
  constructor(private readonly websitesService: WebsitesService) {}

  @Post()
  @ApiBody({
    type: CreateWebsiteDto,
    required: true,
  })
  create(@Body() createWebsiteDto: Website) {
    return this.websitesService.create(createWebsiteDto);
  }

  @Get()
  @ApiQuery({
    type: 'string',
    name: 'startedAt',
    required: true,
    example: startOfDay(new Date()).toISOString(),
  })
  @ApiQuery({
    type: 'string',
    name: 'endedAt',
    required: true,
    example: endOfDay(new Date()).toISOString(),
  })
  findAll(
    @Query('startedAt') startedAt: string,
    @Query('endedAt') endedAt: string
  ): Promise<Website[]> {
    return this.websitesService.findAll(startedAt, endedAt);
  }

  @Patch()
  @ApiParam({
    type: 'string',
    name: 'id',
    required: true,
  })
  findOne(@Param('id') id: string): Promise<Website> {
    return this.websitesService.findOne(id);
  }

  @Delete()
  @ApiParam({
    type: 'string',
    name: 'id',
    required: true,
  })
  async delete(@Param('id') id: string): Promise<void> {
    await this.websitesService.delete(id);
  }
}
