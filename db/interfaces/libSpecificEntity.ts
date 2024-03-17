import type {
  SQLiteColumn,
  SQLiteTableWithColumns,
} from 'drizzle-orm/sqlite-core';

export interface LibSpecificEntity
  extends SQLiteTableWithColumns<{
    name: any;
    schema: undefined;
    dialect: 'sqlite';
    columns: {
      libraryId: SQLiteColumn<{
        name: 'libraryId';
        tableName: any;
        dataType: 'string';
        columnType: 'SQLiteText';
        notNull: true;
        hasDefault: false;
        data: any;
        driverParam: any;
        enumValues: any;
      }>;
    };
  }> {}
