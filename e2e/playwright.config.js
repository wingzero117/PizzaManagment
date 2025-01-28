const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 1,
  use: {
    baseURL: 'http://3.147.58.86',
    headless: true,
    trace: 'on-first-retry',
  },
});
