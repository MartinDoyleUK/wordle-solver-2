/* eslint-disable canonical/filename-match-exported */
import { type Config } from 'jest';

const config: Config = {
  moduleNameMapper: {
    '(.+)\\.js': '$1'
  },
  modulePathIgnorePatterns: ["<rootDir>/dist/"]
};

export default config;
