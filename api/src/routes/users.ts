import expressRouter from 'express-promise-router';
import { Request, Response } from 'express';
import { Connection, RowDataPacket } from 'mysql2/promise';
import { authenticate } from 'passport';
import { dbAuthenticated } from '../middleware/db-connection';
import inRole from '../middleware/in-role';
import { User, UserRole } from '../types/user';
import { userRolesFromRows } from '../services/user-roles';

const router = expressRouter();

router.get('/:page', authenticate('jwt', {session: false}), inRole(UserRole.UserEditor), dbAuthenticated, getUsersByPage);

export const PAGE_SIZE = 20;

export async function getUsersByPage(req: Request, res: Response) {
  // base-0:
  let pageNum = parseInt(req.params.page, 10);
  if (pageNum < 0 || isNaN(pageNum)) {
    pageNum = 0;
  }
  const db: Connection = res.locals.db;

  const [userRows/*, fields*/] = await db.query<RowDataPacket[]>('select `user` from users where is_deleted = 0 limit ? offset ?', [PAGE_SIZE, (PAGE_SIZE * pageNum)]);
  let [roleRows/*, fields*/] = await db.query<RowDataPacket[]>('select `user`, `group` from users_groups');
  if (!roleRows) {
    roleRows = [];
  }

  const results: User[] = (userRows || []).map(u => {
    const user: User = {
      username: u.user,
      roles: userRolesFromRows(u.user, roleRows)
      // NO PASSWORD returned
    };
    return user;
  });

  res.json(results || []);
}

export default router;
