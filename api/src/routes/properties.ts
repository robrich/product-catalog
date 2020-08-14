import expressRouter from 'express-promise-router';
import { Request, Response } from 'express';
import { Connection, RowDataPacket, OkPacket } from 'mysql2/promise';
import { authenticate } from 'passport';
import { Product, productCodeRegex, productPropertyRegex } from '../types/product';

const router = expressRouter();

router.get('/:productCode', authenticate('jwt', {session: false}), getProductProperties);
router.post('/:productCode', authenticate('jwt', {session: false}), createProductProperty);
router.put('/:productCode', authenticate('jwt', {session: false}), updateProductProperty);
router.delete('/:productCode/:name', authenticate('jwt', {session: false}), deleteProductProperty);

// not for public consumption, exported for testing
export async function getProductProperties(req: Request, res: Response) {
  const productCode = req.params.productCode || '';
  if (!productCode || !productCodeRegex.test(productCode)) {
    return res.status(404).end();
  }
  const db: Connection = req.app.locals.db;

  const [rows/*, fields*/] = await db.execute<RowDataPacket[]>('SELECT properties FROM catalog WHERE productCode = ?', [productCode]);
  if (!rows || !rows.length) {
    return res.status(404).end();
  }

  const product = rows[0] as Product;
  /* difficult to test:
  if (!product || !product.properties) {
    return res.status(404).end();
  }
  */

  res.json(product.properties);
}

// not for public consumption, exported for testing
export async function createProductProperty(req: Request, res: Response) {
  const productCode = req.params.productCode || '';
  const { name, value } = req.body;
  if (!productCode || !productCodeRegex.test(productCode)) {
    return res.status(404).end();
  }
  if (!name || !value || !productPropertyRegex.test(name)) {
    return res.status(400).end();
  }

  const db: Connection = req.app.locals.db;

  const [result] = await db.execute<OkPacket>('UPDATE catalog SET properties = JSON_SET_STRING(properties, ?, ?) WHERE productCode = ?', [name, value, productCode]);

  if (result.changedRows < 1) {
    return res.status(404).end();
  }

  res.status(201).end();
}

// not for public consumption, exported for testing
export async function updateProductProperty(req: Request, res: Response) {
  const productCode = req.params.productCode || '';
  const { name, value } = req.body;
  if (!productCode || !productCodeRegex.test(productCode)) {
    return res.status(404).end();
  }
  if (!name || !value || !productPropertyRegex.test(name)) {
    return res.status(400).end();
  }

  const db: Connection = req.app.locals.db;

  const [result] = await db.execute<OkPacket>('UPDATE catalog SET properties = JSON_SET_STRING(properties, ?, ?) WHERE productCode = ?', [name, value, productCode]);

  // result.changedRows only shows if it changed, not if we found the row
  if (result.affectedRows < 1) {
    return res.status(404).end();
  }

  res.status(200).end();
}

// not for public consumption, exported for testing
export async function deleteProductProperty(req: Request, res: Response) {
  const productCode = req.params.productCode || '';
  const name = req.params.name || '';
  if (!productCode || !productCodeRegex.test(productCode)) {
    return res.status(404).end();
  }
  if (!name || !productPropertyRegex.test(name)) {
    return res.status(400).end();
  }

  const db: Connection = req.app.locals.db;

  const [result] = await db.execute<OkPacket>('UPDATE catalog SET properties = JSON_DELETE_KEY(properties, ?) WHERE productCode = ?', [name, productCode]);

  if (result.changedRows < 1) {
    return res.status(404).end();
  }

  res.status(200).end();
}

export default router;
