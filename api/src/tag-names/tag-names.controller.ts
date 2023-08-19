import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { TagNamesService } from './tag-names.service';
import { CreateTagNameDto } from './dto/create-tag-name.dto';
// import { UpdateTagNameDto } from './dto/update-tag-name.dto';

@Controller('tag-names')
export class TagNamesController {
  constructor(private readonly tagNamesService: TagNamesService) {}

  @Post()
  create(@Body() createTagNameDto: CreateTagNameDto) {
    return this.tagNamesService.create(createTagNameDto);
  }

  @Get()
  findAll(@Query('term') term: string) {
    return this.tagNamesService.findAll(term);
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
