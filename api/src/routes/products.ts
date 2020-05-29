import expressRouter from 'express-promise-router';

const router = expressRouter();

router.get('/:page', async (req, res) => {
  // base-0:
  const pageNum = parseInt(req.params.page, 10);
  const pageSize = 20;
  const active = typeof req.query.active === 'undefined' || req.query.active === 'true';
  const db = req.app.locals.db;

  const [rows/*, fields*/] = await db.query('SELECT id, productCode, name, active FROM catalog WHERE active = ? or active = true limit ? offset ?', [active, pageSize, (pageSize * pageNum)]);

  res.json(rows || []);
});

export default router;
