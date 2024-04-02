import { relations, sql } from 'drizzle-orm';
import { sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';
import type { InsertType, SelectType, links } from '../interfaces';
import {
  chapters,
  libraries,
  seriesLanes,
  type Library,
  type SeriesLane,
  type Chapter,
} from '.';

export const series = sqliteTable(
  'series',
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
    name: text('name').notNull(),
    alias: text('alias'),
    description: text('description'),
    links: text('links', { mode: 'json' }).$type<links>(),
  },
  t => ({
    unq: unique().on(t.libraryId, t.alias),
  })
);

export type Series = SelectType<typeof series>;
export type NewSeries = InsertType<typeof series>;

export const seriesRelations = relations(series, ({ one, many }) => ({
  library: one(libraries, {
    fields: [series.libraryId],
    references: [libraries.id],
  }),
  lanes: many(seriesLanes),
  chapters: many(chapters),
}));

export type FullSeries = Series & {
  library: Library;
  lanes: SeriesLane[];
  chapters: Chapter[];
};
