import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateTagDto } from './create-tag.dto';
import { IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class TagDto {
  @IsString()
  @Type(() => String)
  @ApiPropertyOptional({
    type: String,
    description: 'Id of the tag',
  })
  id: string;

  @IsString()
  @Type(() => String)
  @ApiPropertyOptional({
    type: String,
    description: 'Tag name id',
    default: undefined,
  })
  tagNameId: string;

  @IsString()
  @Type(() => String)
  @ApiPropertyOptional({
    type: String,
    description: 'Start time in iso format',
    default: undefined,
  })
  startedAt: string;

  @IsString()
  @Type(() => String)
  @ApiPropertyOptional({
    type: String,
    description: 'End time in ISO format',
    default: undefined,
  })
  endedAt: string;
}
