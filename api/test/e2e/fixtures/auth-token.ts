import supertest from 'supertest';
import { createServer, Server } from 'http';
import { Express } from 'express';
import appInit from '../../../src/app';


export default async function getAuthToken(username?: string | undefined, password?: string | undefined): Promise<string> {

  const app: Express = await appInit();

  const server: Server = createServer(app);
  const req = supertest(server);
  if (!username && !password) {
    username = process.env.TEST_ADMIN_USERNAME;
    password = process.env.TEST_ADMIN_PASSWORD;
  }
  const res = await req.post(`/api/auth/`)
    .send({username, password});

  if (!res.body.token) {
    throw new Error(`failed to login with ${username} in test`);
  }

  return res.body.token;
}
