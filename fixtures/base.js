const { test: base } = require('@playwright/test');
const config = require('../config.json');

const test = base.extend({
  // Provides the parsed config to every test
  appConfig: async ({}, use) => {
    await use(config);
  },

  // Authenticated page for a given module and role
  // Usage: test('...', async ({ authenticatedPage }) => { ... })
  // Override via test.use({ roleKey: 'GRO' }) etc.
  moduleKey: ['PGR', { option: true }],
  roleKey: ['CSR', { option: true }],

  authenticatedPage: async ({ page, appConfig, moduleKey, roleKey }, use) => {
    const creds = appConfig.credentials?.[moduleKey]?.[roleKey];
    if (!creds) throw new Error(`No credentials for ${moduleKey}/${roleKey}`);
    // Store credentials on the page object so tests can access them
    page._creds = creds;
    await use(page);
  },
});

module.exports = { test, expect: base.expect };
