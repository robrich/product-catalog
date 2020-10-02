import { config as envConfig } from 'dotenv';
import supertest, { Response } from 'supertest';
import { createServer, Server } from 'http';
import { Express } from 'express';
import { v4 as guid } from 'uuid';
import appInit from '../../../src/app';
import { User, UserRole } from '../../../src/types/user';
import getAuthToken from '../fixtures/auth-token';
import { fakeUsername } from '../fixtures/user-create';


describe('routes/auth:e2e', () => {
  let app: Express;
  let server: Server;

  beforeAll(() => {
    envConfig(); // FRAGILE: can't unload environment variables
  });

  beforeEach(async () => {
    app = await appInit();
    server = createServer(app);
  });

  [
    {status: 401, method: 'get', url: '/api/auth/'},
    // not a valid test because can't login with no user/pass:
    // {status: 401, method: 'put', url: '/api/auth/'},
    {status: 200, method: 'get', url: '/api/products/0'},
    {status: 404, method: 'get', url: `/api/product/not-found-${guid()}`},
    {status: 401, method: 'post', url: '/api/product'},
    {status: 401, method: 'put', url: '/api/product/-1'},
    {status: 401, method: 'delete', url: '/api/product/-1'},
    {status: 401, method: 'get', url: `/api/properties/not-found-${guid()}`},
    {status: 401, method: 'post', url: `/api/properties/not-found-${guid()}`},
    {status: 401, method: 'put', url: `/api/properties/not-found-${guid()}`},
    {status: 401, method: 'delete', url: `/api/properties/not-found-${guid()}/prop-${guid()}`},
    {status: 401, method: 'get', url: '/api/users/0'},
    {status: 401, method: 'get', url: `/api/user/${fakeUsername()}`},
    {status: 401, method: 'post', url: '/api/user'},
    {status: 401, method: 'put', url: `/api/user/${fakeUsername()}`},
    {status: 401, method: 'delete', url: `/api/user/${fakeUsername()}`}
  ].forEach(({status, method, url}: {status: number, method: string, url: string}) => {
    it(`should get ${status} when ${method} to ${url}`, async () => {

      // arrange
      const req = supertest(server);

      // act
      // not valid typescript: const res = await req[method](url);
      let res: Response;
      switch (method) {
        case 'get':
          res = await req.get(url);
          break;
        case 'post':
          res = await req.post(url);
          break;
        case 'put':
          res = await req.put(url);
          break;
        case 'delete':
          res = await req.delete(url);
          break;
        default:
          throw new Error(`don\'t know how to ${method}`);
      }

      // assert
      expect(res.status).toEqual(status);

    });
  });

  [
    {method: 'post', url: '/api/product'},
    {method: 'put', url: '/api/product/-1'},
    {method: 'delete', url: '/api/product/-1'},
    {method: 'get', url: `/api/properties/not-found-${guid()}`},
    {method: 'post', url: `/api/properties/not-found-${guid()}`},
    {method: 'put', url: `/api/properties/not-found-${guid()}`},
    {method: 'delete', url: `/api/properties/not-found-${guid()}/prop-${guid()}`},
    {method: 'get', url: '/api/users/0'},
    {method: 'get', url: `/api/user/${fakeUsername()}`},
    {method: 'post', url: '/api/user'},
    {method: 'put', url: `/api/user/${fakeUsername()}`},
    {method: 'delete', url: `/api/user/${fakeUsername()}`}
  ].forEach(({method, url}: {method: string, url: string}) => {
    it(`should get 401 when underauthenticated ${method} to ${url}`, async () => {

      // arrange
      const status = 401
      const username = process.env.TEST_READ_ONLY_USERNAME;
      const password = process.env.TEST_READ_ONLY_PASSWORD;
      const token = await getAuthToken(username, password);
      const req = supertest(server);

      // act
      // not valid typescript: const res = await req[method](url);
      let res: Response;
      switch (method) {
        case 'get':
          res = await req.get(url)
            .set('Authorization', 'Bearer '+token);
          break;
        case 'post':
          res = await req.post(url)
            .set('Authorization', 'Bearer '+token);
          break;
        case 'put':
          res = await req.put(url)
            .set('Authorization', 'Bearer '+token);
          break;
        case 'delete':
          res = await req.delete(url)
            .set('Authorization', 'Bearer '+token)
          break;
        default:
          throw new Error(`don\'t know how to ${method}`);
      }

      // assert
      expect(res.status).toEqual(status);
    });

  });

  it('should login and get user info', async () => {

    // test 1: login

    // arrange
    const req = supertest(server);
    const username = process.env.TEST_ADMIN_USERNAME;
    const password = process.env.TEST_ADMIN_PASSWORD;

    // act
    let res = await req.post(`/api/auth/`)
      .send({username, password});

    // assert
    expect(res.status).toEqual(200);
    expect(res.body.token).toBeTruthy();

    // test 2: use the token to get current user

    // arange
    const token = res.body.token;

    // act
    res = await req.get(`/api/auth/`)
      .set('Authorization', 'Bearer '+token);

    const user = res.body as User | undefined;

    // assert
    expect(res.status).toEqual(200);
    expect(user?.username).toEqual(username);
    expect(user?.secret).toBeUndefined();
    expect(user?.roles?.sort()).toEqual([UserRole.CatalogEditor, UserRole.UserEditor].sort());

  });

});
