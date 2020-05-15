import expressRouter from 'express-promise-router';

const router = expressRouter();

router.get('/:id', async (req, res) => {
  const id = req.params.id || 0;
  const db = req.app.locals.db;

  const [rows/*, fields*/] = await db.execute('SELECT productCode, name, description, properties, active FROM catalog WHERE id = ?', [id]);
  if (!rows || !rows.length) {
    return res.status(404).end();
  }

  res.json(rows[0]);
});

export default router;
