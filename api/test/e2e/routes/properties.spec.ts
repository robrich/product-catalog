import supertest from 'supertest';
import { createServer, Server } from 'http';
import { Express } from 'express';
import { v4 as guid } from 'uuid';
import appInit from '../../../src/app';
import { Product } from '../../../src/types/product';
import { saveFakeProduct } from '../fixtures/product-create';
import getAuthToken from '../fixtures/auth-token';


describe('routes/properties:e2e', () => {
  let app: Express;
  let server: Server;
  const productCode = 'prop-test-'+guid();
  let product: Product; // mutates this object throughout the tests
  let token: string;

  beforeAll(async () => {
    token = await getAuthToken();
    product = await saveFakeProduct(productCode, token);
  });

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

  it('should get product properties by product code', async () => {

    // arrange

    // act
    const req = supertest(server);
    const res = await req.get(`/api/properties/${productCode}`)
      .set('Authorization', 'Bearer '+token);

    // assert
    expect(res.status).toEqual(200);
    const properties: unknown = res.body;

    expect(properties).toEqual(product.properties);

  });

  it('should create a product property', async () => {

    // arrange
    const name = `prop-${guid()}`;
    const value = `value-${guid()}`;
    const expected: any = product.properties;
    expected[name] = value;

    // act
    const req = supertest(server);
    let res = await req.post(`/api/properties/${productCode}`)
      .set('Authorization', 'Bearer '+token)
      .send({name, value});

    // assert
    expect(res.status).toEqual(201);

    // go get it and ensure it exists
    res = await req.get(`/api/properties/${productCode}`)
      .set('Authorization', 'Bearer '+token);
    expect(res.status).toEqual(200);
    const actual: unknown = res.body;

    expect(actual).toEqual(expected);

  });

  it('should modify a product property', async () => {

    // arrange
    const expected: any = product.properties;
    const name = Object.keys(expected)[0];
    const value = 'changed prop value '+guid();
    expected[name] = value;

    // act
    const req = supertest(server);
    let res = await req.put(`/api/properties/${productCode}`)
      .set('Authorization', 'Bearer '+token)
      .send({name, value});

    // assert
    expect(res.status).toEqual(200);

    // go get it and ensure it changed
    res = await req.get(`/api/properties/${productCode}`)
      .set('Authorization', 'Bearer '+token);
    expect(res.status).toEqual(200);
    expect(res.body).toBeTruthy();
    const actual: unknown = res.body;

    expect(actual).toEqual(expected);

  });

  it('should delete a product property', async () => {

    // arrange
    const expected: any = product.properties;
    const name = Object.keys(expected).reverse()[0];
    delete expected[name];

    // act
    const req = supertest(server);
    let res = await req.delete(`/api/properties/${productCode}/${encodeURIComponent(name)}`)
      .set('Authorization', 'Bearer '+token);

    // assert
    expect(res.status).toEqual(200);

    // go get it and ensure it's gone
    res = await req.get(`/api/properties/${productCode}`)
      .set('Authorization', 'Bearer '+token);

    // assert
    const actual: unknown = res.body;
    expect(actual).toEqual(expected);

  });

});
