import supertest from 'supertest';
import { createServer, Server } from 'http';
import { Express } from 'express';
import { v4 as guid } from 'uuid';
import appInit from '../../../src/app';
import { User, UserRole } from '../../../src/types/user';


export function fakeUsername() {
  return 'test'+guid().replace(/\-/g, '');
}

export function fakeUser(username: string, roles: UserRole[]): User {
  const user: User = {
    username,
    roles,
    secret: 'test-fixture-'+guid()
  };
  return user;
}

export async function saveFakeUser(username: string, roles: UserRole[], token: string): Promise<User> {
  const app: Express = await appInit();

  const server: Server = createServer(app);

  const user: User = fakeUser(username, roles);
  const req = supertest(server);

  const res = await req.post('/api/user')
    .set('Authorization', 'Bearer '+token)
    .send(user);

  if (res.status !== 201) {
    throw new Error(`got failing status when creating ${username}: status: ${res.status}, body: ${JSON.stringify(res.body, null, 2)}`);
  }

  return user;
}
