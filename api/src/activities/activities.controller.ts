import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { Activity } from '../types/types';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  create(@Body() createActivityDto: Activity) {
    return this.activitiesService.create(createActivityDto);
  }

  @Get()
  findAll(@Query('startedAt') startedAt: string, @Query('endedAt') endedAt: string): Promise<Activity[]> {
    return this.activitiesService.findAll(startedAt, endedAt);
  }
}
