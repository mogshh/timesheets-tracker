import { Controller } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('database')
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}
}
