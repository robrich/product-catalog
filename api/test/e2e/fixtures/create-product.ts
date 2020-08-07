import supertest from 'supertest';
import { createServer, Server } from 'http';
import { Express } from 'express';
import { v4 as guid } from 'uuid';
import appInit from '../../../src/app';
import { Product } from '../../../src/types/product';


export default async function createProduct(productCode: string, token: string): Promise<Product> {
  const app: Express = await appInit();

  try {
    const server: Server = createServer(app);

    const product: Product = {
      id: 0,
      productCode,
      name: 'test product '+guid(),
      description: 'this product was created by a test',
      active: true,
      properties: {
        has: 'json'
      }
    };
    const req = supertest(server);

    const res = await req.post('/api/product')
      .set('Authorization', 'Bearer '+token)
      .send(product);

    if (res.status !== 201) {
      throw new Error(`got failing status when creating ${productCode}: status: ${res.status}`);
    }

    return product;

  } finally {
    const db = app?.locals?.db;
    if (db) {
      await db.end();
    }
  }
}