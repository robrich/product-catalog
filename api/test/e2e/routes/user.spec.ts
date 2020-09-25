import { config as envConfig } from 'dotenv';
import supertest from 'supertest';
import { createServer, Server } from 'http';
import { Express } from 'express';
import { v4 as guid } from 'uuid';
import appInit from '../../../src/app';
import { User, UserRole } from '../../../src/types/user';
import { fakeUsername, fakeUser, saveFakeUser } from '../fixtures/user-create';
import getAuthToken from '../fixtures/auth-token';


describe('routes/user:e2e', () => {
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

  it('should get user by username', async () => {

    // arrange
    const username = fakeUsername();
    const roles: UserRole[] = [UserRole.CatalogReadOnly];
    const expected = await saveFakeUser(username, roles, token);
    const req = supertest(server);

    // act
    const res = await req.get(`/api/user/${username}`);

    // assert
    expect(res.status).toEqual(200);
    const user = res.body as User | undefined;

    expect(user?.username).toEqual(username);
    expect(user?.roles?.sort()).toEqual(roles.sort());
    expect(user?.secret).toEqual(undefined);

  });

  it('should create a user', async () => {

    // arrange
    const username = fakeUsername();
    const roles: UserRole[] = [];
    const expected: User = fakeUser(username, roles);
    expected.secret = 'test-pass-'+guid();
    const req = supertest(server);

    // act
    let res = await req.post('/api/user')
      .set('Authorization', 'Bearer '+token)
      .send(expected);

    // assert
    delete expected.secret;
    expect(res.status).toEqual(201);

    // go get it and ensure it exists
    res = await req.get(`/api/user/${expected.username}`);
    expect(res.status).toEqual(200);
    const actual = res.body as User;

    expect(actual).toEqual(expected);

  });

  it('should modify a user', async () => {

    // arrange
    const username = fakeUsername();
    const roles: UserRole[] = [UserRole.UserEditor, UserRole.CatalogEditor];
    const expected = await saveFakeUser(username, roles, token);

    expected.roles = [UserRole.CatalogReadOnly];
    const req = supertest(server);

    // act
    let res = await req.put(`/api/user/${username}`)
      .set('Authorization', 'Bearer '+token)
      .send(expected);

    // assert
    expect(res.status).toEqual(200);

    // go get it and ensure it changed
    res = await req.get(`/api/user/${username}`);
    expect(res.status).toEqual(200);
    expect(res.body).toBeTruthy();
    const actual = res.body as User;

    expect(actual).toEqual(expected);

  });

  it('should modify a user password', async () => {

    // arrange
    const username = fakeUsername();
    const password = 'test-pass-'+guid();
    const roles: UserRole[] = [UserRole.CatalogEditor];
    const expected = await saveFakeUser(username, roles, token);

    expected.secret = password;
    const req = supertest(server);

    // act
    let res = await req.put(`/api/user/${username}`)
      .set('Authorization', 'Bearer '+token)
      .send(expected);

    // assert
    expect(res.status).toEqual(200);

    // go get it and ensure it changed
    res = await req.post(`/api/auth/`)
      .send({username, password});
    expect(res.status).toEqual(200);
    expect(res.body.token).toBeTruthy();

  });

  it('should delete a user', async () => {

    // arrange
    const username = fakeUsername();
    const roles: UserRole[] = [UserRole.CatalogReadOnly];
    const expected = await saveFakeUser(username, roles, token);
    const req = supertest(server);

    // act
    let res = await req.delete(`/api/user/${username}`)
      .set('Authorization', 'Bearer '+token);

    // assert
    expect(res.status).toEqual(200);

    // go get it and ensure it's gone
    res = await req.get(`/api/user/${username}`);
    expect(res.status).toEqual(404);

  });

});
