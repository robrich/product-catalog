import expressRouter from 'express-promise-router';
import { Request, Response } from 'express';
import { Connection, RowDataPacket } from 'mysql2/promise';

const router = expressRouter();

router.get('/:productCode', getProductByProductCode);

// not for public consumption, exported for testing
export async function getProductByProductCode(req: Request, res: Response) {
  const productCode = req.params.productCode || '';
  if (!productCode) {
    return res.status(404).end();
  }
  const db: Connection = req.app.locals.db;

  const [rows/*, fields*/] = await db.execute<RowDataPacket[]>('SELECT productCode, name, description, properties, active FROM catalog WHERE productCode = ?', [productCode]);
  if (!rows || !rows.length) {
    return res.status(404).end();
  }

  res.json(rows[0]);
}

export default router;
