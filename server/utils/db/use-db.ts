import { type Client, createClient } from '@libsql/client';
import { LibSQLDatabase, drizzle } from 'drizzle-orm/libsql';
import * as schema from '~/db/schema';

let sqlClient: Client | undefined;
let db: LibSQLDatabase<typeof schema> | undefined;

export function useDb () {
  if (sqlClient && db) return db;

  if (!process.env.APP_TURSO_DB_URL ||
    (!process.env.APP_TURSO_DB_TOKEN && process.env.NODE_ENV !== 'development'))
    throw new Error('DB Credentials are missing!');

  sqlClient = createClient({
    url: process.env.APP_TURSO_DB_URL!,
    authToken: process.env.APP_TURSO_DB_TOKEN,
  });

  db = drizzle(sqlClient, { schema });

  return db;
}
