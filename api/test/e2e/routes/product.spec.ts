import supertest from 'supertest';
import { createServer, Server } from 'http';
import { Express } from 'express';
import { v4 as guid } from 'uuid';
import appInit from '../../../src/app';
import { Product } from '../../../src/types/product';
import { fakeProduct, saveFakeProduct } from '../fixtures/product-create';
import getAuthToken from '../fixtures/auth-token';


describe('routes/product:e2e', () => {
  let app: Express;
  let server: Server;
  let token: string;

  beforeAll(async () => {
    token = await getAuthToken();
  });

  beforeEach(async () => {
    app = await appInit();
    server = createServer(app);
  });

  it('should get product by product code', async () => {

    // arrange
    const productCode = 'test-'+guid();
    const expected = await saveFakeProduct(productCode, token);
    const req = supertest(server);

    // act
    const res = await req.get(`/api/product/${productCode}`);

    // assert
    expect(res.status).toEqual(200);
    const product = res.body as Product | undefined;

    expect(product?.productCode).toEqual(productCode);
    expect(product?.id).toBeGreaterThan(0);
    expect(product?.id).toEqual(expected.id);

  });

  it('should create a product', async () => {

    // arrange
    const productCode = 'test-'+guid();
    const expected: Product = fakeProduct(productCode);
    const req = supertest(server);

    // act
    let res = await req.post('/api/product')
      .set('Authorization', 'Bearer '+token)
      .send(expected);

    // assert
    expect(res.status).toEqual(201);
    expected.id = res.body?.id;
    expect(expected.id).toBeGreaterThan(0);

    // go get it and ensure it exists
    res = await req.get(`/api/product/${expected.productCode}`);
    expect(res.status).toEqual(200);
    const actual = res.body as Product;

    expect(actual).toEqual(expected);

  });

  it('should modify a product', async () => {

    // arrange
    const productCode = 'test-'+guid();
    const expected = await saveFakeProduct(productCode, token);
    const productId = expected.id;

    expected.name = 'changed test product '+guid();
    expected.properties = {
      mod: 'ified'
    };
    expected.description = 'the product description is changed in this unit test'
    const req = supertest(server);

    // act
    let res = await req.put(`/api/product/${productId}`)
      .set('Authorization', 'Bearer '+token)
      .send(expected);

    // assert
    expect(res.status).toEqual(200);

    // go get it and ensure it changed
    res = await req.get(`/api/product/${productCode}`);
    expect(res.status).toEqual(200);
    expect(res.body).toBeTruthy();
    const actual = res.body as Product;

    expect(actual).toEqual(expected);

  });

  it('should delete a product', async () => {

    // arrange
    const productCode = 'test-'+guid();
    const expected = await saveFakeProduct(productCode, token);
    const productId = expected.id;
    const req = supertest(server);

    // act
    let res = await req.delete(`/api/product/${productId}?force=true`)
      .set('Authorization', 'Bearer '+token);

    // assert
    expect(res.status).toEqual(200);

    // go get it and ensure it's gone
    res = await req.get(`/api/product/${productCode}`);
    expect(res.status).toEqual(404);

  });

});
