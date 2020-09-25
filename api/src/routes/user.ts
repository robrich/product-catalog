import expressRouter from 'express-promise-router';
import { Request, Response } from 'express';
import { Connection, RowDataPacket, OkPacket } from 'mysql2/promise';
import { authenticate } from 'passport';
import { User, UserRole, usernameRegex } from '../types/user';
import { dbAuthenticated } from '../middleware/db-connection';
import inRole from '../middleware/in-role';
import { userRolesFromRows } from '../services/user-roles';

const router = expressRouter();

router.get('/:username', authenticate('jwt', {session: false}), inRole(UserRole.UserEditor), dbAuthenticated, getUser);
router.post('/', authenticate('jwt', {session: false}), inRole(UserRole.UserEditor), dbAuthenticated, upsertUser);
router.put('/:username', authenticate('jwt', {session: false}), inRole(UserRole.UserEditor), dbAuthenticated, upsertUser);
router.delete('/:username', authenticate('jwt', {session: false}), inRole(UserRole.UserEditor), dbAuthenticated, deleteUser);

// not for public consumption, exported for testing
export function validateUser(user: User | undefined): string[] {

  if (!user) {
    return ['user'];
  }
  if (!user.username || !usernameRegex.test(user.username)) {
    return ['username'];
  }
  // TODO: validate all roles are real roles

  return [];
}

// not for public consumption, exported for testing
export async function getUser(req: Request, res: Response) {
  const username: string = req.params.username;
  if (!username || !usernameRegex.test(username)) {
    return res.status(400).end();
  }


  const db: Connection = res.locals.db;

  const [userRows/*, fields*/] = await db.query<RowDataPacket[]>('select `user` from information_schema.users where is_deleted = 0 and `user` = ?', [username]);
  if (!userRows?.length) {
    return res.status(404).end();
  }

  const userAndHost = `'${username}'@'%'`;
  let [roleRows/*, fields*/] = await db.query<RowDataPacket[]>('select `user`, `group` from information_schema.users_groups where `user` = ?', [userAndHost]);
  if (!roleRows) {
    roleRows = [];
  }

  const dbUsername: string = userRows[0].user;
  const user: User = {
    username: dbUsername,
    roles: userRolesFromRows(dbUsername, roleRows)
    // NO PASSWORD returned
  };

  res.json(user);
}

// not for public consumption, exported for testing
export async function upsertUser(req: Request, res: Response) {
  const username: string = req.params.username;
  const user: User = req.body;
  if (username) {
    user.username = username;
  }
  const errors = validateUser(user);
  if (errors.length) {
    return res.status(400).json(errors);
  }

  const db: Connection = res.locals.db;

  // get the user
  const userAndHost = `'${username}'@'%'`;
  const [userRows/*, fields*/] = await db.query<RowDataPacket[]>('select `user` from information_schema.users where is_deleted = 0 and `user` = ?', [username]);

  if (!userRows?.length) {
    // create user
    await db.query<OkPacket>('create user ? identified by ?', [user.username, user.secret]);
  } else if (user.secret) {
    // change password
    await db.query<OkPacket>('SET PASSWORD FOR ? = PASSWORD(?);', [user.username, user.secret]);
  }

  // reconcile roles
  let [roleRows/*, fields*/] = await db.query<RowDataPacket[]>('select `user`, `group` from information_schema.users_groups where `user` = ?', [userAndHost]);
  if (!roleRows) {
    roleRows = [];
  }
  const dbRoles = userRolesFromRows(user.username, roleRows);
  const uxRoles = user.roles;

  const toAdd = uxRoles.filter(ur => !dbRoles.find(dr => dr === ur));
  const toDelete = dbRoles.filter(dr => !uxRoles.find(ur => dr === ur));

  for (const td of toDelete) {
    await db.execute<OkPacket>('revoke group ? from ?', [td, user.username]);
  }
  for (const ta of toAdd) {
    await db.execute<OkPacket>('grant group ? to ?', [ta, user.username]);
  }

  if (userRows?.length) {
    res.status(200).end();
  } else {
    res.location(`${req.baseUrl}/${user.username}`);
    res.status(201).end();
  }
}

// not for public consumption, exported for testing
export async function deleteUser(req: Request, res: Response) {
  const username: string = req.params.username;
  if (!username || !usernameRegex.test(username)) {
    return res.status(400).end();
  }

  const db: Connection = res.locals.db;

  await db.execute<OkPacket>('DROP USER IF EXISTS ?', [username]);

  res.status(200).end();
}

export default router;
