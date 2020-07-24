import passport from 'passport';
import { callbackify } from 'util';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from '../types/auth';

export default function init() {

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('process.env.JWT_SECRET is undefined');
  }

  const jwtOpts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
    //issuer: 'my.site.com',
    //audience: 'my.site.com'
  };

  passport.use(new Strategy(jwtOpts, callbackify(verifyJwt)));

}

export async function verifyJwt(jwtPayload: JwtPayload | undefined) {
  await Promise.resolve();

  if (!jwtPayload) {
    return null;
  }

  // TODO: add database call
  // const user = await db.getUser(jwtPayload.id);

  return jwtPayload;
}
