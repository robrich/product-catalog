import expressRouter from 'express-promise-router';
import { Request, Response } from 'express';
import { Connection, RowDataPacket, OkPacket } from 'mysql2/promise';
import { authenticate } from 'passport';
import { Product } from '../types/product';

export const PRODUCT_CODE_REGEX = /^[a-zA-Z0-9\-]+$/;

const router = expressRouter();

router.get('/:productCode', getProductByProductCode);
router.post('/', authenticate('jwt', {session: false}), createProduct);
router.put('/:id', authenticate('jwt', {session: false}), updateProductById);
router.delete('/:id', authenticate('jwt', {session: false}), deleteProductById);

// not for public consumption, exported for testing
export async function getProductByProductCode(req: Request, res: Response) {
  const productCode = req.params.productCode || '';
  if (!productCode) {
    return res.status(404).end();
  }
  const db: Connection = req.app.locals.db;

  const [rows/*, fields*/] = await db.execute<RowDataPacket[]>('SELECT id productCode, name, description, properties, active FROM catalog WHERE productCode = ?', [productCode]);
  if (!rows || !rows.length) {
    return res.status(404).end();
  }

  rows[0].active = !!rows[0].active;

  res.json(rows[0]);
}

// not for public consumption, exported for testing
export async function createProduct(req: Request, res: Response) {
  const product: Product = req.body;
  if (!product || !product.productCode || !product.name || !PRODUCT_CODE_REGEX.test(product.productCode)) {
    return res.status(400).end();
  }
  // TODO: better validate the product
  if (typeof product.active === 'undefined') {
    product.active = true;
  }
  if (typeof product.properties === 'undefined') {
    product.properties = {};
  }

  const db: Connection = req.app.locals.db;

  const [result] = await db.execute<OkPacket>('INSERT INTO catalog (productCode, name, description, properties, active) VALUES (?,?,?,?,?)', [product.productCode, product.name, product.description || null, JSON.stringify(product.properties), product.active]);

  const id = result.insertId;

  res.location(`${req.baseUrl}/${product.productCode}`);
  res.status(201).json({id});
}

// not for public consumption, exported for testing
export async function updateProductById(req: Request, res: Response) {
  const id: number = parseInt(req.params.id, 10);
  const product: Product = req.body;
  if (id < 1 || isNaN(id) || !product || !product.productCode || !product.name || !PRODUCT_CODE_REGEX.test(product.productCode)) {
    return res.status(400).end();
  }
  // TODO: better validate the product
  if (typeof product.active === 'undefined') {
    product.active = true;
  }
  if (typeof product.properties === 'undefined') {
    product.properties = {};
  }

  const db: Connection = req.app.locals.db;

  const [result] = await db.execute<OkPacket>('UPDATE catalog SET productCode = ?, name = ?, description = ?, properties = ?, active = ? WHERE id = ?', [product.productCode, product.name, product.description || null, JSON.stringify(product.properties), product.active, id]);

  if (result.changedRows === 0) {
    return res.status(404).end();
  }

  res.status(200).end();
}

// not for public consumption, exported for testing
export async function deleteProductById(req: Request, res: Response) {
  const id: number = parseInt(req.params.id, 10);
  const force = !!req.query.force;
  if (id < 1 || isNaN(id)) {
    return res.status(400).end();
  }

  const db: Connection = req.app.locals.db;

  if (force) {
    await db.execute<OkPacket>('DELETE FROM catalog WHERE id = ?', [id]);
  } else {
    await db.execute<OkPacket>('UPDATE catalog SET active = false id = ?', [id]);
  }

  res.status(200).end();
}

export default router;
