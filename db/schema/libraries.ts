import { relations, sql } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { InsertType, SelectType } from '../interfaces';
import { defaultLanes, series, users } from '.';

export const libraries = sqliteTable('libraries', {
  id: text('id')
    .primaryKey()
    .notNull()
    .default(sql`(lower(hex(randomblob(16))))`),
  name: text('name').notNull(),
  alias: text('alias').unique(),
});

export type Library = SelectType<typeof libraries>;
export type NewLibrary = InsertType<typeof libraries>;

export const libraryRelations = relations(libraries, ({ many }) => ({
  series: many(series),
  users: many(users),
  defaultLanes: many(defaultLanes),
}));
