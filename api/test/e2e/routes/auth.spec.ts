import supertest, { Test, Response } from 'supertest';
import { createServer, Server } from 'http';
import { Express } from 'express';
import { v4 as guid } from 'uuid';
import appInit from '../../../src/app';


describe('routes/auth:e2e', () => {
  let app: Express;
  let server: Server;

  beforeEach(async () => {
    app = await appInit();
    server = createServer(app);
  });

  afterEach(async () => {
    const db = app?.locals?.db;
    if (db) {
      await db.end();
    }
  });

  [
    {status: 401, method: 'get', url: '/api/auth/'},
    // not a valid test because can't login with no user/pass:
    // {status: 401, method: 'put', url: '/api/auth/'},
    {status: 200, method: 'get', url: '/api/products/0'},
    {status: 404, method: 'get', url: `/api/product/not-found-${guid()}`},
    {status: 401, method: 'post', url: '/api/product'},
    {status: 401, method: 'put', url: '/api/product/-1'},
    {status: 401, method: 'delete', url: '/api/product/-1'}
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

  it('should login and get user info', async () => {

    // test 1: login

    // arrange
    const req = supertest(server);
    const email = 'some@user.com';
    const password = 'somepassword';

    // act
    let res = await req.post(`/api/auth/`)
      .send({email, password});

    // assert
    expect(res.status).toEqual(200);
    expect(res.body.token).toBeTruthy();

    // test 2: use the token to get current user

    // arange
    const token = res.body.token;

    // act
    res = await req.get(`/api/auth/`)
      .set('Authorization', 'Bearer '+token);

    // assert
    expect(res.status).toEqual(200);
    expect(res.body.email).toEqual(email);

  });

});
