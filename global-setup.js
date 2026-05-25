/**
 * Runs once before the entire test suite.
 * Logs in as TL_SU and saves the browser storage state to auth-tl.json
 * so all tests can reuse the session without re-logging in.
 */
const { chromium } = require('@playwright/test');
const path = require('path');

module.exports = async function globalSetup() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  await page.goto('https://unified-demo.digit.org/digit-ui/employee/user/login');
  await page.locator('input[name="username"]').waitFor({ state: 'visible', timeout: 20000 });
  await page.fill('input[name="username"]', 'TL_SU');
  await page.fill('input[type="password"]', 'eGov@1234');
  await page.locator('.employee-select-wrap--elipses').click();
  await page.locator('#jk-dropdown-unique').waitFor({ state: 'visible', timeout: 8000 });
  await page.locator('#jk-dropdown-unique .profile-dropdown--item')
    .filter({ hasText: 'Victoria City' }).first().click();
  await page.locator('button[type="submit"]').click();
  await page.waitForURL(url => !url.href.includes('/user/login'), { timeout: 25000 });
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});

  await context.storageState({ path: path.join(__dirname, 'auth-tl.json') });
  await browser.close();
  console.log('\n✓ Auth state saved for TL_SU — tests will skip login\n');
};
