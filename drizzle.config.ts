import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './db/schema/index.ts',
  driver: 'turso',
  dbCredentials: {
    url: process.env.APP_TURSO_DB_URL!,
    authToken: process.env.APP_TURSO_DB_TOKEN,
  },
  out: './db/drizzle',
  breakpoints: false,
});
