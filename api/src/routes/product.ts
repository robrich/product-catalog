import expressRouter from 'express-promise-router';

const router = expressRouter();

router.get('/:productCode', async (req, res) => {
  const productCode = req.params.productCode || '';
  if (!productCode) {
    res.status(404).end();
  }
  const db = req.app.locals.db;

  const [rows/*, fields*/] = await db.execute('SELECT productCode, name, description, properties, active FROM catalog WHERE productCode = ?', [productCode]);
  if (!rows || !rows.length) {
    return res.status(404).end();
  }

  res.json(rows[0]);
});

export default router;
