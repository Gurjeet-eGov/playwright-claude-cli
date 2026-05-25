const { test: base } = require('@playwright/test');
const path = require('path');
const config = require('../config.json');

const AUTH_FILE = path.join(__dirname, '..', 'auth-tl.json');

const test = base.extend({
  appConfig: async ({}, use) => { await use(config); },

  // Reuses the auth state saved by global-setup — no login on every test
  tlPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: AUTH_FILE,
      ignoreHTTPSErrors: true,
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

module.exports = { test, expect: base.expect };
