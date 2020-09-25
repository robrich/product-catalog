import { RowDataPacket } from 'mysql2/promise';
import { UserRole } from '../../../src/types/user';
import { userRolesFromRows } from '../../../src/services/user-roles';


describe('services/user-roles', () => {

  it('should return empty when no matching roles', () => {

    // arrange
    const username = 'test-user';
    const roleRows: RowDataPacket[] = [];
    const expected: UserRole[] = [];

    // act
    const actual = userRolesFromRows(username, roleRows);

    // assert
    expect(actual.sort()).toEqual(expected.sort());

  });

  it('should return roles when passing matches and other user roles', () => {

    // arrange
    const username = 'test-user';
    const roleRows = [
      {
        user: `'${username}'@'%'`,
        group: UserRole.CatalogEditor
      },
      {
        user: `'${username}'@'%'`,
        group: UserRole.UserEditor
      },
      {
        user: `'other-user'@'%'`,
        group: UserRole.UserEditor
      },
      {
        user: `'other-user'@'%'`,
        group: UserRole.CatalogReadOnly
      }
    ] as RowDataPacket[];
    const expected: UserRole[] = [UserRole.CatalogEditor, UserRole.UserEditor];

    // act
    const actual = userRolesFromRows(username, roleRows);

    // assert
    expect(actual.sort()).toEqual(expected.sort());

  });

});

