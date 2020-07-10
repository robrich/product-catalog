import supertest from 'supertest';
import { createServer, Server } from 'http';
import { Express } from 'express';
import appInit from './app';
import { PAGE_SIZE } from './routes/products';
import { Product } from './types/product';


describe('app:e2e', () => {
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

  it('should get the product list page and the product detail for the first product', async () => {

    // test 1: product list

    // arrange
    const req = supertest(server);

    // act
    let res = await req.get(`/api/products/0`);

    // assert
    expect(res.status).toEqual(200);
    const products = res.body as Product[] | undefined;

    expect(products?.length).toBeGreaterThanOrEqual(1);
    expect(products?.length).toBeLessThanOrEqual(PAGE_SIZE);
    if (!products) {
      throw new Error('blank product list from product list page');
    }


    // test 2: product detail

    // arrange
    const productCode = products[0].productCode;

    // act
    res = await req.get(`/api/product/${productCode}`);

    // assert
    expect(res.status).toEqual(200);
    const product = res.body as Product | undefined;

    expect(product?.productCode).toEqual(productCode);

  }, 5000); // wait longer

  it('should not show login info when not logged in', async () => {

    // arrange
    const req = supertest(server);

    // act
    let res = await req.get(`/api/auth/`);

    // assert
    expect(res.status).toEqual(401);

  }, 5000); // wait longer

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

  }, 5000); // wait longer

});
