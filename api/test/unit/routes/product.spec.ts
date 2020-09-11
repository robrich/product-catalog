import { getProductByProductCode } from '../../../src/routes/product'; // suite under test
import { Product } from '../../../src/types/product';
import { makeMockRequest } from '../mocks/mock-request';
import { makeMockResponse } from '../mocks/mock-response';
import { makeMockDb } from '../mocks/mock-db';

describe('routes/product', () => {

  it('should return product when found in database', async () => {

    // arrange
    const productCode = 'unit-test';
    const product = {
      productCode
    } as Product;

    // mocks
    const db = makeMockDb<Product[]>([product]);
    const req = makeMockRequest({params: {productCode}});
    const res = makeMockResponse<Product>(db);

    // act
    await getProductByProductCode(req, res);

    // assert
    expect(res.state.status).toBe(undefined); // not set
    expect(res.state.json).toBe(product);

  });

  it('should return 404 when not found in database', async () => {

    // arrange
    const productCode = 'unit-test';
    const product = undefined;

    // mocks
    const db = makeMockDb<Product[]>([]);
    const req = makeMockRequest({params: {productCode}});
    const res = makeMockResponse<Product>(db);

    // act
    await getProductByProductCode(req, res);

    // assert
    expect(res.state.status).toBe(404);
    expect(res.state.json).toBe(product);
    expect(db.state.values?.[0]).toBe(productCode);
  });

  it('should return 404 when no productCode passed', async () => {

    // arrange
    const product = undefined;

    // mocks
    const db = makeMockDb<Product[]>([]);
    const req = makeMockRequest({}); // blank productCode
    const res = makeMockResponse<Product>(db);

    // act
    await getProductByProductCode(req, res);

    // assert
    expect(res.state.status).toBe(404);
    expect(res.state.json).toBe(product);
    expect(db.state.values).toBe(undefined);

  });

});
