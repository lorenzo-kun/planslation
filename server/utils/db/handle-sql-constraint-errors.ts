import type { ResultSet } from '@libsql/client';
import type {
  SQLiteInsertBase,
  SQLiteInsertReturning,
  SQLiteInsertReturningAll,
  SQLiteTable,
  SelectedFieldsFlat,
} from 'drizzle-orm/sqlite-core';

const errorTypes = {
  NOT_NULL: 'NOT NULL',
  UNIQUE: 'UNIQUE',
};

export const tryInsert = async <
  TTable extends SQLiteTable,
  TColumns extends SelectedFieldsFlat
>(
  insertFn: () =>
    | SQLiteInsertReturningAll<
        SQLiteInsertBase<TTable, 'async', ResultSet>,
        false
      >
    | SQLiteInsertReturning<
        SQLiteInsertBase<TTable, 'async', ResultSet>,
        false,
        TColumns
      >
) => {
  try {
    const result = await insertFn();

    return { result };
  } catch (ex: any) {
    if (ex.code === 'SQLITE_CONSTRAINT') {
      const regex = /SQLite error: ([A-Z\s]+) constraint failed: (.*)/;
      const matches = (ex.message as string).match(regex);

      if (matches?.length) {
        const errorType = matches[1];
        const issueProps = matches[2];
        let error = '';

        if (errorType === errorTypes.NOT_NULL) {
          error = `The following values cannot be null: ${issueProps}`;
        } else if (errorType === errorTypes.UNIQUE) {
          error = `The following values must be unique in the table: ${issueProps}`;
        }

        if (error)
          return {
            error: createError({
              statusCode: 400,
              message: error,
            }),
          };
      }
    }

    throw ex;
  }
};
