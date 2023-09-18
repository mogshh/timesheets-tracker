import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class CreateAutoTagDto {
  @IsString()
  @Type(() => String)
  @ApiPropertyOptional({
    type: String,
    description: 'Id of the tagName',
    default: undefined,
  })
  tagNameId: string;

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
