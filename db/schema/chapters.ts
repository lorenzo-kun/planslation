import { relations, sql } from 'drizzle-orm';
import { sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';
import type { InsertType, SelectType, links } from '../interfaces';
import { series, seriesLanes, users } from '.';

export const chapters = sqliteTable(
  'chapters',
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
    currentLaneId: text('currentLaneId').references(() => seriesLanes.id, {
      onUpdate: 'cascade',
      onDelete: 'set null',
    }),
    assignedUserId: text('assignedUserId').references(() => users.id, {
      onUpdate: 'cascade',
      onDelete: 'set null',
    }),
    shortName: text('shortName').notNull(),
    targetLanguage: text('targetLanguage').notNull(),
    fullName: text('fullName'),
    originalName: text('originalName'),
    links: text('links', { mode: 'json' }).$type<links>(),
  },
  t => ({
    unq: unique().on(t.seriesId, t.shortName),
  })
);

export type Chapter = SelectType<typeof chapters>;
export type NewChapter = InsertType<typeof chapters>;

export const chapterRelations = relations(chapters, ({ one }) => ({
  series: one(series, {
    fields: [chapters.seriesId],
    references: [series.id],
  }),
  currentLane: one(seriesLanes, {
    fields: [chapters.currentLaneId],
    references: [seriesLanes.id],
  }),
  assignedUser: one(users, {
    fields: [chapters.assignedUserId],
    references: [users.id],
  }),
}));
