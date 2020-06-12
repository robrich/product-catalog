module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  //testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts)$'
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts']
};
