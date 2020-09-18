import { RowDataPacket } from 'mysql2/promise';
import { UserRole } from '../types/user';


export function userRolesFromRows(username: string, roleRows: RowDataPacket[]) {

  const userAndHost = `'${username}'@'%'`;
  const userRoles = (roleRows || []).filter(r => r.user === userAndHost);
  const roles: UserRole[] = [];
  if (userRoles.length) {
    userRoles.forEach(r => {
      if (r.group === UserRole.UserEditor) {
        roles.push(UserRole.UserEditor);
      } else if (r.group === UserRole.CatalogEditor) {
        roles.push(UserRole.CatalogEditor);
      } else if (r.group === UserRole.CatalogReadOnly) {
        roles.push(UserRole.CatalogReadOnly);
      } else {
        // unknown role
      }
    });
  }

  return roles;
}