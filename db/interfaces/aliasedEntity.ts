import type { SQLiteColumn, SQLiteTableWithColumns } from 'drizzle-orm/sqlite-core';

export interface AliasedEntity
  extends SQLiteTableWithColumns<{
    name: any;
    schema: undefined;
    dialect: 'sqlite';
    columns: {
      id: SQLiteColumn<{
        name: 'id';
        tableName: any;
        dataType: 'string';
        columnType: 'SQLiteText';
        notNull: true;
        hasDefault: true;
        data: any;
        driverParam: any;
        enumValues: any;
      }>;
      alias: SQLiteColumn<{
        name: 'alias';
        tableName: any;
        dataType: 'string';
        columnType: 'SQLiteText';
        notNull: false;
        hasDefault: false;
        data: any;
        driverParam: any;
        enumValues: any;
      }>;
    };
  }> {}
