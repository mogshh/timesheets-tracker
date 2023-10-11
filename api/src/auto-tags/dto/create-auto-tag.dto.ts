import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsObject, IsString } from 'class-validator';
import {
  AutoTagCondition,
  BooleanOperator,
  ConditionOperator,
  ConditionVariable,
  TagName,
} from '../../types/types';

export class CreateAutoTagDto {
  @IsString()
  @Type(() => String)
  @ApiPropertyOptional({
    type: String,
    description: 'Id of the tagName',
    default: undefined,
  })
  tagNameId: string;

  @IsString()
  @Type(() => String)
  @ApiPropertyOptional({
    type: String,
    description: 'Name of the tagName',
    default: undefined,
  })
  name: string;

  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({
    type: Number,
    description: 'Priority order in which the auto tags are checked',
    default: 0,
  })
  priority: number;

  @IsString()
  @Type(() => String)
  @ApiPropertyOptional({
    type: String,
    description: 'Conditions for the auto tag',
    default: '[]',
  })
  conditions: string;
}
