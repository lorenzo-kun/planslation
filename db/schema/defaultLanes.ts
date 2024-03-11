import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';
import type { InsertType, SelectType } from '../interfaces';
import { libraries, users } from '.';

export const defaultLanes = sqliteTable(
  'defaultLanes',
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
    title: text('title').notNull(),
    descriptions: text('description'),
    sortOrder: integer('sortOrder', { mode: 'number' }).notNull(),
    autoAssignUserId: text('autoAssignUserId').references(() => users.id, {
      onUpdate: 'cascade',
      onDelete: 'set null',
    }),
    notifyUserIds: text('notifyUserIds').$type<string[]>(),
  },
  t => ({
    unq: unique().on(t.libraryId, t.sortOrder),
  })
);

export type DefaultLane = SelectType<typeof defaultLanes>;
export type NewDefaultLane = InsertType<typeof defaultLanes>;

export const defaultLaneRelations = relations(defaultLanes, ({ one }) => ({
  library: one(libraries, {
    fields: [defaultLanes.libraryId],
    references: [libraries.id],
  }),
  autoAssignUser: one(users, {
    fields: [defaultLanes.autoAssignUserId],
    references: [users.id],
  }),
}));
