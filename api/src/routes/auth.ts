import expressRouter from 'express-promise-router';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate } from 'passport';
import SimpleCrypto from 'simple-crypto-js';
import { dbLogin } from '../services/db-login';
import { User, usernameRegex, UserRole, USER_EDITOR, CATALOG_EDITOR, CATALOG_READ_ONLY } from '../types/user';
import { RowDataPacket } from 'mysql2/promise';

const router = expressRouter();

router.get('/', authenticate('jwt', {session: false}), getCurrentUser);

router.post('/', login);

// not for public consumption, exported for testing
export async function getCurrentUser(req: Request, res: Response) {
  const user = req.user as User;
  if (!user) {
    return res.status(401).end();
  }
  
  const result = Object.assign({}, user);
  delete result.secret;
  res.json(result);
}

// not for public consumption, exported for testing
export async function login(req: Request, res: Response) {
  const { username, password } = req.body;
  if (!username || !password || !usernameRegex.test(username)) {
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

  const userAndHost = `'${username}'@'%'`;
  const [rows/*, fields*/] = await db.execute<RowDataPacket[]>('select `user`, `group` from information_schema.users_groups where `user` = ?', [userAndHost]);

  const roles: UserRole[] = [];
  if (rows?.length) {
    rows.forEach(r => {
      if (r.group === USER_EDITOR) {
        roles.push(UserRole.UserEditor);
      } else if (r.group === CATALOG_EDITOR) {
        roles.push(UserRole.CatalogEditor);
      } else if (r.group === CATALOG_READ_ONLY) {
        roles.push(UserRole.CatalogReadOnly);
      } else {
        // unknown role
      }
    });
  }

  // close db connection -- we're done with it
  await db.end();

  const secret = simpleCrypto.encrypt(password);

  const user: User = {
    username,
    secret,
    roles
  };
  const token = jwt.sign(user, jwtAuthKey, {expiresIn: '6h'});
  delete user.secret;

  res.json({user, token});
}

export default router;
