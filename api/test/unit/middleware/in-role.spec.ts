import inRole from '../../../src/middleware/in-role';
import { User, UserRole } from '../../../src/types/user';
import { makeMockRequest } from '../mocks/mock-request';
import { makeMockResponse } from '../mocks/mock-response';


describe('middleware/in-role', () => {

  it('should return 401 on no user', () => {

    // arrange
    const expectedStatus = 401;
    const expectedCalledNext = false;
    const requiredRole = UserRole.CatalogEditor;
    const user = undefined;

    // act & assert
    runTest(requiredRole, user, expectedStatus, expectedCalledNext);

  });

  it('should return 401 on no matching role', () => {

    // arrange
    const expectedStatus = 401;
    const expectedCalledNext = false;
    const requiredRole = UserRole.CatalogEditor;
    const user = {
      roles: [UserRole.CatalogReadOnly]
    } as User;

    // act & assert
    runTest(requiredRole, user, expectedStatus, expectedCalledNext);

  });

  it('should return next on role match', () => {

    // arrange
    const expectedStatus = undefined;
    const expectedCalledNext = true;
    const requiredRole = UserRole.CatalogEditor;
    const user = {
      roles: [UserRole.CatalogEditor]
    } as User;

    // act & assert
    runTest(requiredRole, user, expectedStatus, expectedCalledNext);

  });

  function runTest(requiredRole: UserRole, user: User | undefined, expectedStatus: number | undefined, expectedCalledNext: boolean) {

    // mocks
    const req = makeMockRequest({user});
    const res = makeMockResponse();

    // act
    let calledNext = false;
    const inRoleMiddleware = inRole(requiredRole);
    inRoleMiddleware(req, res, () => {
      calledNext = true;
    });

    // assert
    expect(res.state.status).toEqual(expectedStatus);
    expect(calledNext).toEqual(expectedCalledNext);

  }

});
