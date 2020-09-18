import { User, UserRole } from './user';

export type UserModel = {
  username: string;
  catalogReadOnly: boolean;
  catalogEditor: boolean;
  userEditor: boolean;
  secret?: string | undefined;
}

export function userToModel(user: User): UserModel {
  return {
    username: user.username,
    catalogReadOnly: !!user.roles.find(r => r === UserRole.CatalogReadOnly),
    catalogEditor: !!user.roles.find(r => r === UserRole.CatalogEditor),
    userEditor: !!user.roles.find(r => r === UserRole.UserEditor),
    secret: user.secret
  };
}

export function userFromModel(user: UserModel): User {
  const roles: UserRole[] = [];
  if (user.catalogReadOnly) {
    roles.push(UserRole.CatalogReadOnly);
  }
  if (user.catalogEditor) {
    roles.push(UserRole.CatalogEditor);
  }
  if (user.userEditor) {
    roles.push(UserRole.UserEditor);
  }
  return {
    username: user.username,
    roles,
    secret: user.secret
  };
}
