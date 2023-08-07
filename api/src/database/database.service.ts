import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { AsyncDatabase } from 'promised-sqlite3';

@Injectable()
export class DatabaseService implements OnApplicationBootstrap {
  public db: AsyncDatabase;

  async onApplicationBootstrap(): Promise<void> {
    this.db = await AsyncDatabase.open('./timesheets-tracker-database.sqlite3');
    this.db.inner.on('trace', (sql: string) => console.info('[TRACE]', sql));
  }
}
