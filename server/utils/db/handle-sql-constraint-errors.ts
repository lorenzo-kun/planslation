import type {
  SQLiteInsert,
  SQLiteTable,
  SQLiteUpdate,
} from 'drizzle-orm/sqlite-core';

const errorTypes = {
  NOT_NULL: 'NOT NULL',
  UNIQUE: 'UNIQUE',
};

const handleException = (ex: any) => {
  if (ex.code === 'SQLITE_CONSTRAINT') {
    const regex = /SQLite error: ([A-Z\s]+) constraint failed: (.*)/;
    const matches = (ex.message as string).match(regex);

    if (matches?.length) {
      const errorType = matches[1];
      const issueProps = matches[2];
      let error = '';

      if (errorType === errorTypes.NOT_NULL)
        error = `The following values cannot be null: ${issueProps}`;
      else if (errorType === errorTypes.UNIQUE)
        error = `The following values must be unique in the table: ${issueProps}`;

      if (error)
        return createError({
          statusCode: 400,
          message: error,
        });
    }
  }

  throw ex;
};

export const tryInsert = async <TTable extends SQLiteTable>(
  insertFn: SQLiteInsert<
    TTable,
    'async',
    any,
    Partial<TTable['$inferSelect']> | undefined
  >
) => {
  try {
    const result = await insertFn;

    return { result };
  } catch (ex: any) {
    return { error: handleException(ex) };
  }
};

export const tryUpdate = async <TTable extends SQLiteTable>(
  updateFn: SQLiteUpdate<
    TTable,
    'async',
    any,
    Partial<TTable['$inferSelect']> | undefined
  >
) => {
  try {
    const result = await updateFn.execute();

    return { result };
  } catch (ex: any) {
    return { error: handleException(ex) };
  }
};
