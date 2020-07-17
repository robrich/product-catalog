import express from 'express';
import logger from 'morgan';
import { join } from 'path';
import { config as envConfig } from 'dotenv';
import { createConnection, Connection } from 'mysql2/promise';

import productRouter from './routes/product';
import productsRouter from './routes/products';
import indexRouter from './routes/index';
import authRouter from './routes/auth';
import passportInit from './services/passport';

export default async function init() {
  envConfig();

  passportInit();

  const db: Connection = await createConnection({
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
  app.use('/api/auth', authRouter);
  app.use('/api/product', productRouter);
  app.use('/api/products', productsRouter);

  return app;
};
