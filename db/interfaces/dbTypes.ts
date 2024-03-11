import type { SQLiteTable } from 'drizzle-orm/sqlite-core';

export type SelectType<T extends SQLiteTable> = T['$inferSelect'];
export type InsertType<T extends SQLiteTable> = Omit<T['$inferInsert'], 'id'>;
