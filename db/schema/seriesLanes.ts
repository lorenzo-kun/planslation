import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';
import type { InsertType, SelectType } from '../interfaces';
import { series, users } from '.';

export const seriesLanes = sqliteTable(
  'seriesLanes',
  {
    id: text('id')
      .primaryKey()
      .notNull()
      .default(sql`(lower(hex(randomblob(16))))`),
    seriesId: text('seriesId')
      .notNull()
      .references(() => series.id, {
        onUpdate: 'cascade',
        onDelete: 'cascade',
      }),
    title: text('title').notNull(),
    description: text('description'),
    sortOrder: integer('sortOrder').notNull(),
    autoAssignUserId: text('autoAssignUserId').references(() => users.id, {
      onUpdate: 'cascade',
      onDelete: 'set null',
    }),
    notifyUserIds: text('notifyUserIds').$type<string[]>(),
  },
  t => ({
    unq: unique().on(t.seriesId, t.sortOrder),
  })
);

export type SeriesLane = SelectType<typeof seriesLanes>;
export type NewSeriesLane = InsertType<typeof seriesLanes>;

export const seriesLaneRelations = relations(seriesLanes, ({ one }) => ({
  series: one(series, {
    fields: [seriesLanes.seriesId],
    references: [series.id],
  }),
  autoAssignUser: one(users, {
    fields: [seriesLanes.autoAssignUserId],
    references: [users.id],
  }),
}));
