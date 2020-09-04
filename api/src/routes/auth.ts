import expressRouter from 'express-promise-router';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate } from 'passport';
import SimpleCrypto from 'simple-crypto-js';
import { dbLogin } from '../services/db-login';

const router = expressRouter();

router.get('/', authenticate('jwt', {session: false}), getCurrentUser);

router.post('/', login);

// not for public consumption, exported for testing
export async function getCurrentUser(req: Request, res: Response) {
  if (req.user) {
    // TODO: don't expose password
    res.json(req.user);
  } else {
    res.status(401).end();
  }
}

// not for public consumption, exported for testing
export async function login(req: Request, res: Response) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(401).json({message: 'Invalid username / password'});
  }

  const jwtAuthKey = process.env.JWT_SECRET;
  if (!jwtAuthKey) {
    throw new Error('process.env.JWT_SECRET is undefined');
  }

  const simpleCrypto = new SimpleCrypto(jwtAuthKey);

  const db = await dbLogin(username, password);
  if (!db) {
    return res.status(401).json({message: 'Invalid username / password'});
  }

  const secret = simpleCrypto.encrypt(password);

  const user = {
    username,
    secret
  };
  const token = jwt.sign(user, jwtAuthKey, {expiresIn: '6h'});
  delete user.secret;

  res.json({user, token});
}

export default router;
