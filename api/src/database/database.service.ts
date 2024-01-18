import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kysely, sql, SqliteDialect } from 'kysely';
import Database from 'better-sqlite3';

@Injectable()
export class DatabaseService implements OnModuleInit {
  public db: Kysely<any>;

  async onModuleInit(): Promise<void> {
    this.db = new Kysely<any>({
      dialect: new SqliteDialect({
        database: new Database('./timesheets-tracker-database.sqlite3'),
      }),
    });

    await this.createTables();
  }

  /**
   * Create database tables if they do not exist yet
   */
  async createTables(): Promise<void> {
    await sql`
      CREATE TABLE IF NOT EXISTS activities
      (
        "id"          text NOT NULL PRIMARY KEY,
        "programName" text,
        "windowTitle" text,
        "startedAt"   text NOT NULL,
        "endedAt"     text NOT NULL
      );
    `.execute(this.db);

    await sql`
      CREATE TABLE IF NOT EXISTS activeStates
      (
        "id"          text NOT NULL PRIMARY KEY,
        "isActive"    boolean,
        "startedAt"   text NOT NULL,
        "endedAt"     text NOT NULL
      );
    `.execute(this.db);

    await sql`
            CREATE TABLE IF NOT EXISTS tagNames
            (
                "id"        text NOT NULL PRIMARY KEY,
                "name"      text NOT NULL,
                "color"     text NOT NULL
            );
				`.execute(this.db);

    await sql`
        CREATE TABLE IF NOT EXISTS tags
        (
            "id"        text NOT NULL PRIMARY KEY,
            "tagNameId" text NOT NULL,
            "startedAt" text NOT NULL,
            "endedAt"   text NOT NULL,
            FOREIGN KEY ("tagNameId") REFERENCES "tagNames" ("id") ON DELETE CASCADE ON UPDATE CASCADE
        );
		`.execute(this.db);

    await sql`
        CREATE TABLE IF NOT EXISTS autoTags
        (
            "id"        text NOT NULL PRIMARY KEY,
            "name"      text NOT NULL,
            "tagNameId" text NOT NULL,
            "priority"  int NOT NULL,
            "conditions" text NOT NULL,
            FOREIGN KEY ("tagNameId") REFERENCES "tagNames" ("id") ON DELETE CASCADE ON UPDATE CASCADE
        );
    `.execute(this.db);
  }
}
