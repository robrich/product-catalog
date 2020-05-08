import express from 'express';
import logger from 'morgan';
import { join } from 'path';
import { config as envConfig } from 'dotenv';
import { createConnection } from 'mysql2/promise';

import productRouter from './routes/product';
import indexRouter from './routes/index';

export default async function init() {
  envConfig();

  const db = await createConnection({
    host: process.env.MEMSQL_HOST,
    user: process.env.MEMSQL_USERNAME,
    password: process.env.MEMSQL_PASSWORD,
    database: process.env.MEMSQL_DB,
    namedPlaceholders: true
  });
  const app = express();
  app.locals.db = db;

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(join(__dirname, '../public')));

  app.use('/', indexRouter);
  app.use('/api/product', productRouter);

  return app;
}
