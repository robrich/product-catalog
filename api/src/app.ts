import express from 'express';
import logger from 'morgan';
import { join } from 'path';
import { config as envConfig } from 'dotenv';

import passportInit from './services/passport';
import indexRouter from './routes/index';
import authRouter from './routes/auth';
import productsRouter from './routes/products';
import productRouter from './routes/product';
import propertiesRouter from './routes/properties';
import usersRouter from './routes/users';

export default async function init() {
  envConfig();

  passportInit();

  const app = express();

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(join(__dirname, '../public')));

  app.use('/', indexRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/products', productsRouter);
  app.use('/api/product', productRouter);
  app.use('/api/properties', propertiesRouter);
  app.use('/api/users', usersRouter);

  return app;
};
