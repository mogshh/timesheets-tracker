import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
// import { AutoTagsService } from './auto-tags.service';
import { CreateAutoTagDto } from './dto/create-auto-tag.dto';
import { ApiQuery } from '@nestjs/swagger';
import { AutoTagsService } from './auto-tags.service';
// import { UpdateTagNameDto } from './dto/update-tag-name.dto';

@Controller('tag-names')
export class AutoTagsController {
  constructor(private readonly tagNamesService: AutoTagsService) {}

  @Post()
  create(@Body() createTagNameDto: CreateAutoTagDto) {
    return this.tagNamesService.create(createTagNameDto);
  }

  @Get()
  @ApiQuery({ name: 'term', required: false, type: 'string' })
  findAll(@Query('term') term?: string) {
    return this.tagNamesService.findAll(term);
  }

  @Get('/count')
  async count(): Promise<{ count: number }> {
    return {
      count: await this.tagNamesService.count(),
    };
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagNamesService.findOne(+id);
  }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTagNameDto: UpdateTagNameDto) {
  //   return this.tagNamesService.update(+id, updateTagNameDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.tagNamesService.remove(+id);
  // }
}
