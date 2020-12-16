// module.exports = {
//   // testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
//
//
//
//   // collectCoverageFrom: ['components/**/*.tsx', 'pages/**/*.tsx', 'src/**/*.tsx'],
//
// };

module.exports = {
  bail: 1,
  clearMocks: true,
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageReporters: ['lcov', 'text'],
  setupFilesAfterEnv: ['<rootDir>/__test__/setup-tests.js'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/__test__/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.css$': '<rootDir>/__test__/cssTransform.js',
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
  },
}
