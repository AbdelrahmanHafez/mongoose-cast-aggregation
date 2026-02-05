import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': ['ts-jest', { diagnostics: false, tsconfig: { module: 'commonjs' } }]
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  }
};

export default config;