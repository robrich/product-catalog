import { config as envConfig } from 'dotenv';
import { dbLogin } from '../../../src/services/db-login';


describe('services/db-login', () => {

  envConfig(); // FRAGILE: can't unload environment variables

  it('should return null when no username passed', async () => {

    // arrange
    const username = undefined;
    const password = process.env.TEST_ADMIN_PASSWORD;
    const expected = false;

    // act & assert
    await doTest(username, password, expected);

  });

  it('should return null when no password passed', async () => {

    // arrange
    const username = process.env.TEST_ADMIN_USERNAME;
    const password = undefined;
    const expected = false;

    // act & assert
    await doTest(username, password, expected);

  });

  it('should return null on auth fail', async () => {

    // arrange
    const username = process.env.TEST_ADMIN_USERNAME;
    const password = 'bad password';
    const expected = false;

    // act & assert
    await doTest(username, password, expected);

  });

  it('should return null on auth fail', async () => {

    // arrange
    const username = 'username with invalid CHARACTERS!!!';
    const password = process.env.TEST_ADMIN_PASSWORD;
    const expected = false;

    // act & assert
    await doTest(username, password, expected);

  });

  it('should return db on auth success', async () => {

    // arrange
    const username = process.env.TEST_ADMIN_USERNAME;
    const password = process.env.TEST_ADMIN_PASSWORD;
    const expected = true;

    // act & assert
    await doTest(username, password, expected);

  });

  async function doTest(username: string | undefined, password: string | undefined, expected: boolean) {

    // act
    const db = await dbLogin(username, password);
    if (db) {
      await db.end();
    }

    // assert
    if (expected) {
      expect(db).toBeTruthy();
    } else {
      expect(db).toBeNull();
    }
  }

});
