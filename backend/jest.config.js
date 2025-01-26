module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.ts'],
    setupFilesAfterEnv: ["<rootDir>/src/tests/setup.ts"],
    moduleDirectories: ["node_modules", "src"],
    moduleFileExtensions: ['ts', 'js'],
    
  };
  