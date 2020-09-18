import { UserRole } from './user';

export type VuexData = {
  jwt: string | undefined;
  username: string | undefined;
  roles: UserRole[];
};

export type LoginData = {
  jwt: string | undefined;
  username: string | undefined;
  roles: UserRole[] | undefined;
}
