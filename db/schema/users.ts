import { relations, sql } from 'drizzle-orm';
import {
  blob,
  integer,
  sqliteTable,
  text,
  unique,
} from 'drizzle-orm/sqlite-core';
import type { InsertType, SelectType } from '../interfaces';
import { chapters, favorites, libraries } from '.';

export const users = sqliteTable(
  'users',
  {
    id: text('id')
      .primaryKey()
      .notNull()
      .default(sql`(lower(hex(randomblob(16))))`),
    libraryId: text('libraryId')
      .notNull()
      .references(() => libraries.id, {
        onUpdate: 'cascade',
        onDelete: 'cascade',
      }),
    email: text('email').notNull(),
    displayName: text('name'),
    profileImage: blob('profileImage', { mode: 'buffer' }),
    isActive: integer('isActive', { mode: 'boolean' }).notNull().default(false),
    isAdmin: integer('isAdmin', { mode: 'boolean' }).notNull().default(false),
  },
  t => ({
    unq: unique().on(t.libraryId, t.email),
  })
);

export type User = SelectType<typeof users>;
export type NewUser = InsertType<typeof users>;

export const userRelations = relations(users, ({ one, many }) => ({
  library: one(libraries, {
    fields: [users.libraryId],
    references: [libraries.id],
  }),
  favorites: many(favorites),
  assignedChapters: many(chapters),
}));
