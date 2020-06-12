import { getProductsByPage, PAGE_SIZE } from './products'; // suite under test
import { Product } from '../types/product';
import { makeMockRequest } from '../mocks/mock-request';
import { makeMockResponse } from '../mocks/mock-response';
import { makeMockDb } from '../mocks/mock-db';

describe('routes/products', () => {

  it('should return products when found in database', async () => {

    // arrange
    const page = 0;
    const products = [
      {
        productCode: 'abc'
      } as Product,
      {
        productCode: 'def'
      } as Product
    ];

    // mocks
    const db = makeMockDb<Product[]>(products);
    const req = makeMockRequest(db, {params: {page: `${page}`}});
    const res = makeMockResponse<Product[]>();

    // act
    await getProductsByPage(req, res);

    // assert
    expect(res.state.json).toBe(products);
    expect(res.state.status).toBe(undefined); // not set
    expect(db.state.values?.[2]).toEqual(page * PAGE_SIZE);

  });

  it('should return empty array when database returns undefined', async () => {

    // arrange
    const page = 100;
    const products: Product[] = [];

    // mocks
    const db = makeMockDb<undefined>(undefined); // empty
    const req = makeMockRequest(db, {params: {page: `${page}`}});
    const res = makeMockResponse<Product[]>();

    // act
    await getProductsByPage(req, res);

    // assert
    expect(res.state.json).toEqual(products);
    expect(res.state.status).toBe(undefined); // not set
    expect(db.state.values?.[2]).toEqual(page * PAGE_SIZE);

  });

  it('should return page 0 when passing invalid page number', async () => {

    // arrange
    const page = 0;

    // mocks
    const db = makeMockDb<Product[]>([]);
    const req = makeMockRequest(db, {params: {}}); // no page parameter
    const res = makeMockResponse<Product[]>();

    // act
    await getProductsByPage(req, res);

    // assert
    expect(db.state.values?.[2]).toEqual(page * PAGE_SIZE);

  });

  it('should return active when not passed active flag', async () => {

    // arrange
    const active = true;
    const products: Product[] = [];

    // mocks
    const db = makeMockDb<Product[]>([]);
    const req = makeMockRequest(db, {query: {}}); // no active parameter
    const res = makeMockResponse<Product[]>();

    // act
    await getProductsByPage(req, res);

    // assert
    expect(db.state.values?.[0]).toEqual(active);

  });

});