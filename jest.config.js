module.exports = {
  clearMocks: true,
  restoreMocks: true,
  preset: 'jest-preset-typescript',
  testEnvironment: 'node',
  collectCoverage: true,
  "collectCoverageFrom": [
    "<rootDir>/src/**/*.{ts,js}",
  ],
  coverageReporters: ['text-summary', 'text'],
};
