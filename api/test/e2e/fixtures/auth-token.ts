import supertest from 'supertest';
import { createServer, Server } from 'http';
import { Express } from 'express';
import appInit from '../../../src/app';


export default async function getAuthToken(): Promise<string> {

  const app: Express = await appInit();

  try {
    const server: Server = createServer(app);
    const req = supertest(server);
    const email = 'some@user.com'; // TODO: config
    const password = 'somepassword'; // TODO: config
    const res = await req.post(`/api/auth/`)
      .send({email, password});

    if (!res.body.token) {
      throw new Error(`failed to login with ${email} in test`);
    }

    return res.body.token;

  } finally {
    const db = app?.locals?.db;
    if (db) {
      await db.end();
    }
  }
}
