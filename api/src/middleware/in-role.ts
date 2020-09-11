import { Request, Response } from 'express';
import { User, UserRole } from '../types/user';


export default function inRole(role: UserRole) {
  return function validateRole(req: Request, res: Response, next: () => void) {

    const user = req.user as User;

    const userInRole = !!(user?.roles?.find(r => r === role));

    // not ok
    if (!userInRole) {
      return res.status(401).json({message: 'Under-authenticated'});
    }

    // ok
    next();
  }
}
