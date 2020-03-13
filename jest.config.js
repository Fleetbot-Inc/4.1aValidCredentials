module.exports = {
  collectCoverageFrom: [
    './**/*.{js,jsx}',
    '!./**/*.test.{js,jsx}',
    '!./**/*.config.{js,jsx}',
    '!./coverage/**/*',
  ],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
  moduleDirectories: ['node_modules', 'app'],
  testRegex: 'tests/.*\\.test\\.js$',
  snapshotSerializers: [],
};
