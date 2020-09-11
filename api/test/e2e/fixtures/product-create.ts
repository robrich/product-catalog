import supertest from 'supertest';
import { createServer, Server } from 'http';
import { Express } from 'express';
import { v4 as guid } from 'uuid';
import appInit from '../../../src/app';
import { Product } from '../../../src/types/product';


export function fakeProduct(productCode: string): Product {
  const product: Product = {
    id: 0,
    productCode,
    name: 'test product '+guid(),
    subtitle: 'this product was created by a test',
    price: 12.34,
    image: 'https://placekitten.com/100/100',
    description: '<p>This product created by a test</p>',
    active: true,
    properties: {
      has: 'json'
    }
  };
  return product;
}

export async function saveFakeProduct(productCode: string, token: string): Promise<Product> {
  const app: Express = await appInit();

  const server: Server = createServer(app);

  const product: Product = fakeProduct(productCode);
  const req = supertest(server);

  const res = await req.post('/api/product')
    .set('Authorization', 'Bearer '+token)
    .send(product);

  if (res.status !== 201) {
    throw new Error(`got failing status when creating ${productCode}: status: ${res.status}, body: ${JSON.stringify(res.body, null, 2)}`);
  }

  product.id = res.body.id;

  return product;
}