import expressRouter from 'express-promise-router';
import { Request, Response } from 'express';
import { Connection, RowDataPacket, OkPacket } from 'mysql2/promise';
import { authenticate } from 'passport';
import sanitizeHtml from 'sanitize-html';
import { Product, productCodeRegex, productPropertyRegex } from '../types/product';
import { dbAnonymous, dbAuthenticated } from '../middleware/db-connection';
import inRole from '../middleware/in-role';
import { UserRole } from '../types/user';

const router = expressRouter();

router.get('/:productCode', dbAnonymous, getProductByProductCode);
router.post('/', authenticate('jwt', {session: false}), inRole(UserRole.CatalogEditor), dbAuthenticated, createProduct);
router.put('/:id', authenticate('jwt', {session: false}), inRole(UserRole.CatalogEditor), dbAuthenticated, updateProductById);
router.delete('/:id', authenticate('jwt', {session: false}), inRole(UserRole.CatalogEditor), dbAuthenticated, deleteProductById);

// not for public consumption, exported for testing
export function validateProduct(product: Product) : boolean {

  if (!product.productCode || !productCodeRegex.test(product.productCode)) {
    return false;
  }
  if (typeof product.active === 'undefined') {
    product.active = true;
  }
  if (typeof product.properties === 'undefined') {
    product.properties = {};
  } else {
    const invalidProps = Object.entries(product.properties).filter(([name, value]) => {
      if (!name || !productPropertyRegex.test(name)) {
        return true;
      } else {
        return false;
      }
    });
    if (invalidProps.length > 0) {
      return false;
    }
  }
  product.subtitle = product.subtitle || null;
  if (product.description) {
    product.description = sanitizeHtml(product.description);
  } else {
    product.description = null;
  }
  if (typeof product.price !== 'number' || isNaN(product.price) || product.price < 0) {
    return false;
  }
  product.image = product.image || null;

  return true;
}

// not for public consumption, exported for testing
export async function getProductByProductCode(req: Request, res: Response) {
  const productCode = req.params.productCode || '';
  if (!productCode) {
    return res.status(404).end();
  }
  const db: Connection = res.locals.db;

  const [rows/*, fields*/] = await db.execute<RowDataPacket[]>('SELECT id, productCode, name, subtitle, price, image, description, properties, active FROM catalog WHERE productCode = ?', [productCode]);
  if (!rows || !rows.length) {
    return res.status(404).end();
  }

  const product: Product = rows[0] as Product;

  product.active = !!product.active;
  product.price = +product.price;

  res.json(product);
}

// not for public consumption, exported for testing
export async function createProduct(req: Request, res: Response) {
  const product: Product = req.body;
  if (!product || !product.productCode || !product.name || !productCodeRegex.test(product.productCode)) {
    return res.status(400).end();
  }
  const valid = validateProduct(product);
  if (!valid) {
    return res.status(400).end();
  }

  const db: Connection = res.locals.db;

  const [result] = await db.execute<OkPacket>('INSERT INTO catalog (productCode, name, subtitle, price, image, description, properties, active) VALUES (?,?,?,?,?,?,?,?)', [product.productCode, product.name, product.subtitle, product.price, product.image, product.description, JSON.stringify(product.properties), product.active]);

  const id = result.insertId;

  res.location(`${req.baseUrl}/${product.productCode}`);
  res.status(201).json({id});
}

// not for public consumption, exported for testing
export async function updateProductById(req: Request, res: Response) {
  const id: number = parseInt(req.params.id, 10);
  const product: Product = req.body;
  if (id < 1 || isNaN(id) || !product || !product.productCode || !product.name || !productCodeRegex.test(product.productCode)) {
    return res.status(400).end();
  }
  product.id = id;
  const valid = validateProduct(product);
  if (!valid) {
    return res.status(400).end();
  }

  const db: Connection = res.locals.db;

  const [result] = await db.execute<OkPacket>('UPDATE catalog SET productCode = ?, name = ?, subtitle = ?, price = ?, image = ?, description = ?, properties = ?, active = ? WHERE id = ?', [product.productCode, product.name, product.subtitle, product.price, product.image, product.description, JSON.stringify(product.properties), product.active, id]);

  // result.changedRows only shows if we actually saved something
  if (result.affectedRows === 0) {
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

  const db: Connection = res.locals.db;

  if (force) {
    await db.execute<OkPacket>('DELETE FROM catalog WHERE id = ?', [id]);
  } else {
    await db.execute<OkPacket>('UPDATE catalog SET active = 0 WHERE id = ?', [id]);
  }

  res.status(200).end();
}

export default router;
