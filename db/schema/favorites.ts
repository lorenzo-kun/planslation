import { relations, sql } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { InsertType, SelectType } from '../interfaces';
import { users, series } from '.';

export const favorites = sqliteTable('favorites', {
  id: text('id')
    .primaryKey()
    .notNull()
    .default(sql`(lower(hex(randomblob(16))))`),
  userId: text('userId')
    .notNull()
    .references(() => users.id, {
      onUpdate: 'cascade',
      onDelete: 'cascade',
    }),
  seriesId: text('seriesId')
    .notNull()
    .references(() => series.id, {
      onUpdate: 'cascade',
      onDelete: 'cascade',
    }),
});

export type Favorite = SelectType<typeof favorites>;
export type NewFavorite = InsertType<typeof favorites>;

export const favoriteRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  series: one(series, {
    fields: [favorites.seriesId],
    references: [series.id],
  }),
}));
