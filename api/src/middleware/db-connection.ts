import { Request, Response } from 'express';
import SimpleCrypto from 'simple-crypto-js';
import { dbLogin } from '../services/db-login';
import { User } from '../types/user';


export async function dbAuthenticated(req: Request, res: Response, next: () => void) {

  const user = req.user as User;
  if (!user) {
    return res.status(401).json({message: 'Please login'});
  }

  const jwtAuthKey = process.env.JWT_SECRET;
  if (!jwtAuthKey) {
    throw new Error('process.env.JWT_SECRET is undefined');
  }

  const simpleCrypto = new SimpleCrypto(jwtAuthKey);

  const username = user.username;
  const password = simpleCrypto.decrypt(user.secret || '') as string | undefined;

  const db = await dbLogin(username, password);

  // not ok
  if (!db) {
    return res.status(401).json({message: 'Please login'});
  }

  res.locals.db = db;

  res.on('finish', async () => {
    // close the connection after the request/response finishes
    await db.end();
  });

  // ok
  next();
}

export async function dbAnonymous(req: Request, res: Response, next: () => void) {

  const username = process.env.MEMSQL_USERNAME;
  const password = process.env.MEMSQL_PASSWORD;

  const db = await dbLogin(username, password);

  // not ok
  if (!db) {
    throw new Error('MEMSQL_USERNAME or MEMSQL_PASSWORD invalid');
  }

  res.locals.db = db;

  res.on('finish', async () => {
    // close the connection after the request/response finishes
    await db.end();
  });

  // ok
  next();
}
