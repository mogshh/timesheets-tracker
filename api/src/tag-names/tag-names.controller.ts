import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { TagNamesService } from './tag-names.service';
import { CreateTagNameDto } from './dto/create-tag-name.dto';
import { ApiQuery } from '@nestjs/swagger';
// import { UpdateTagNameDto } from './dto/update-tag-name.dto';

@Controller('tag-names')
export class TagNamesController {
  constructor(private readonly tagNamesService: TagNamesService) {}

  @Post()
  create(@Body() createTagNameDto: CreateTagNameDto) {
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

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.tagNamesService.findOne(+id);
  // }
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
