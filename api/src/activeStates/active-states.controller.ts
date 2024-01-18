import { Controller, Get, Post, Body, Query, Param, Patch, Delete } from '@nestjs/common';
import { ActiveStatesService } from './active-states.service';
import type { ActiveState } from '../types/types';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { endOfDay, startOfDay } from 'date-fns';

@ApiTags('active-states')
@Controller('active-states')
export class ActiveStatesController {
  constructor(private readonly activeStatesService: ActiveStatesService) {}

  @Post()
  create(@Body() createActiveStateDto: ActiveState) {
    return this.activeStatesService.create(createActiveStateDto);
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
  ): Promise<ActiveState[]> {
    return this.activeStatesService.findAll(startedAt, endedAt);
  }

  @Patch()
  @ApiParam({
    type: 'string',
    name: 'id',
    required: true,
  })
  findOne(@Param('id') id: string): Promise<ActiveState> {
    return this.activeStatesService.findOne(id);
  }

  @Delete()
  @ApiParam({
    type: 'string',
    name: 'id',
    required: true,
  })
  async delete(@Param('id') id: string): Promise<void> {
    await this.activeStatesService.delete(id);
  }
}
