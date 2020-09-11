import expressRouter from 'express-promise-router';
import { Request, Response } from 'express';
import { Connection, RowDataPacket } from 'mysql2/promise';
import { dbAnonymous } from '../middleware/db-connection';

const router = expressRouter();

router.get('/:page', dbAnonymous, getProductsByPage);

export const PAGE_SIZE = 20;

export async function getProductsByPage(req: Request, res: Response) {
  // base-0:
  let pageNum = parseInt(req.params.page, 10);
  if (pageNum < 0 || isNaN(pageNum)) {
    pageNum = 0;
  }
  const active = typeof req.query.active === 'undefined' || req.query.active === 'true';
  const db: Connection = res.locals.db;

  const [rows/*, fields*/] = await db.query<RowDataPacket[]>('SELECT id, productCode, name, image, active FROM catalog WHERE active = ? or active = true limit ? offset ?', [active, PAGE_SIZE, (PAGE_SIZE * pageNum)]);

  if (rows) {
    rows.forEach(r => {
      r.active = !!r.active;
    });
  }

  res.json(rows || []);
}

export default router;
