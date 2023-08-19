import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

// @ts-ignore
import pkg from '../package.json';
import { DatabaseService } from './database/database.service';

@Injectable()
export class AppService {
  status(): { status: string; version: string } {
    return {
      status: 'up',
      version: pkg.version,
    };
  }
}
