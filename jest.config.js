const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

const config = {
  clearMocks: true,
  collectCoverageFrom: [
    'utils/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'app/api/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!components/ui/**',
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '/.next/'],
  coverageReporters: ['text', 'lcov'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/$1' },
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.tsx'],
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/tests/**/*.test.{ts,tsx}'],
  watchman: false,
};

module.exports = createJestConfig(config);
