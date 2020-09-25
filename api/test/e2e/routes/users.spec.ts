import { config as envConfig } from 'dotenv';
import supertest from 'supertest';
import { createServer, Server } from 'http';
import { Express } from 'express';
import appInit from '../../../src/app';
import getAuthToken from '../fixtures/auth-token';
import { User } from '../../../src/types/user';


describe('routes/users:e2e', () => {
  let app: Express;
  let server: Server;
  let token: string;

  beforeAll(async () => {
    envConfig(); // FRAGILE: can't unload environment variables
    token = await getAuthToken();
  });

  beforeEach(async () => {
    app = await appInit();
    server = createServer(app);
  });

  it('should get the list of users', async () => {

    // arrange

    // act
    const req = supertest(server);
    const res = await req.get(`/api/users/0`)
      .set('Authorization', 'Bearer '+token);

    // assert
    expect(res.status).toEqual(200);
    const users: User[] = res.body;

    expect(users?.length).toBeGreaterThan(0);
    const admin = users.find(u => u.username === process.env.TEST_ADMIN_USERNAME);
    expect(admin).toBeTruthy();
    expect(admin?.username).toBe(process.env.TEST_ADMIN_USERNAME);
    expect(admin?.secret).toBe(undefined);

  });

});
