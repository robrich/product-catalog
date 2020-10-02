import { usernameRegex } from '../../../src/types/user';


describe('types/user#usernameRegex', () => {

  [
    {expected: true, username: 'admin'},
    {expected: true, username: 'website'},
    {expected: true, username: 'test0123'}, // numbers ok
    {expected: false, username: 's'}, // too short
    {expected: false, username: 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz'}, // too long
    {expected: false, username: 'invalid characters'},
    {expected: false, username: 'inValIdCharacters'},
    {expected: false, username: 'invalid#$%characters'}
  ].forEach(({username, expected}) => {
    it(`should test ${username} as ${expected}`, () => {

      // arrange

      // act
      const actual = usernameRegex.test(username);

      // assert
      expect(actual).toEqual(expected);

    });
  });

});
