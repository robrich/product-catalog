import supertest from 'supertest';
import { createServer, Server } from 'http';
import { Express } from 'express';
import { v4 as guid } from 'uuid';
import appInit from '../../../src/app';
import { Product } from '../../../src/types/product';
import getProducts from '../fixtures/product-list';
import getAuthToken from '../fixtures/auth-token';
import { fakeProduct } from '../fixtures/product-create';


describe('routes/product:e2e', () => {
  let app: Express;
  let server: Server;
  let products: Product[];
  let token: string;

  beforeAll(async () => {
    products = await getProducts();
    token = await getAuthToken();
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

  it('should get product by product code', async () => {

    // arrange
    const productCode = products[0].productCode;
    const req = supertest(server);

    // act
    const res = await req.get(`/api/product/${productCode}`);

    // assert
    expect(res.status).toEqual(200);
    const product = res.body as Product | undefined;

    expect(product?.productCode).toEqual(productCode);
    expect(product?.id).toBeGreaterThan(0);

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

    // stash it for later
    products.push(expected);

    // go get it and ensure it exists
    res = await req.get(`/api/product/${expected.productCode}`);
    expect(res.status).toEqual(200);
    const actual = res.body as Product;

    expect(actual).toEqual(expected);

  });

  it('should modify a product', async () => {

    // arrange
    const product = products.filter(p => /^test\-/.test(p.productCode))[0];
    expect(product).toBeTruthy(); // fail here? re-run tests to create product
    const productId = product.id;
    const productCode = product.productCode;
    products = products.filter(p => p.id !== productId);

    const expected = Object.assign({}, product);
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
    const product = products.filter(p => /^test\-/.test(p.productCode))[0];
    expect(product).toBeTruthy(); // fail here? re-run tests to create product
    const productId = product.id;
    const productCode = product.productCode;
    products = products.filter(p => p.id !== productId);
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
