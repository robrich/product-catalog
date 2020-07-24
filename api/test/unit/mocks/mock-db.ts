import { Connection, FieldPacket } from 'mysql2/promise';


export type MockConnection<TResult> = Connection & {
  state: {
    sql?: string;
    values?: unknown[]
  }
}

export function makeMockDb<TResult>(results: TResult): MockConnection<TResult> {
  const db = {
    state: {
    }
  } as MockConnection<TResult>;

  async function query(sql: string, values?: unknown[]): Promise<[TResult | undefined, FieldPacket[]]> {
    await Promise.resolve();
    db.state.sql = sql;
    db.state.values = values;
    return [results, []];
  }

  // @ts-ignore
  db.query = query;
  // @ts-ignore
  db.execute = query;

  return db;
}