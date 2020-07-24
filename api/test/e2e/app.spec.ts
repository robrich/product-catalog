import supertest from 'supertest';
import { createServer, Server } from 'http';
import { Express } from 'express';
import appInit from '../../src/app';
import { PAGE_SIZE } from '../../src/routes/products';
import { Product } from '../../src/types/product';


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

  });

});
