import { Connection, createConnection } from 'mysql2/promise';
import { usernameRegex } from '../types/user';


export async function dbLogin(username: string | undefined, password: string | undefined) {

  if (!username || !password || !usernameRegex.test(username)) {
    return null;
  }

  try {
    const db: Connection = await createConnection({
      host: process.env.MEMSQL_HOST,
      user: username,
      password,
      database: process.env.MEMSQL_DB,
      namedPlaceholders: true
    });

    return db;
  } catch (err) {
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log(`login fail for username ${username}`, err, {err});
      return null;
    }
    throw err;
  }
}
