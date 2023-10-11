import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import type { Activity } from '../types/types';
import { ApiQuery } from '@nestjs/swagger';
import { endOfDay, startOfDay } from 'date-fns';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  create(@Body() createActivityDto: Activity) {
    return this.activitiesService.create(createActivityDto);
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
  ): Promise<Activity[]> {
    return this.activitiesService.findAll(startedAt, endedAt);
  }
}
