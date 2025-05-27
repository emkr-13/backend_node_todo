module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/test/**/*.test.ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/server.ts",
    "!src/config/**",
    "!src/utils/logger.ts",
  ],
  coverageDirectory: "coverage",
};
