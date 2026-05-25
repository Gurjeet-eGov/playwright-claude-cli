/**
 * TL-001 to TL-007 — Login & Home Page
 * Optimised from: BL/01, BL/02, BL/03, BL/51–BL/60
 */
const { test, expect } = require('../../fixtures/tl-base');
const { LoginPage } = require('../../pages/LoginPage');

test.describe('TL — Login & Home Page', () => {

  test('TL-001 | Employee login redirects to home with TL module card', async ({ browser, appConfig }) => {
    const ctx = await browser.newContext({ ignoreHTTPSErrors: true });
    const page = await ctx.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(page).toHaveURL(/\/user\/login/);
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await loginPage.loginWithCredentials(appConfig.credentials.TL.SU);
    await expect(page).toHaveURL(/\/digit-ui\/employee/);
    // TL module card must be on home page
    await expect(page.locator('text=New Application, text=Inbox')).toBeVisible({ timeout: 15000 });
    await ctx.close();
  });

  test('TL-002 | TL home card shows Inbox, New Application, Search links', async ({ tlPage }) => {
    await tlPage.goto('https://unified-demo.digit.org/digit-ui/employee');
    await tlPage.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await expect(tlPage.locator('a:has-text("Inbox"), span:has-text("Inbox")')).toBeVisible({ timeout: 15000 });
    await expect(tlPage.locator('a:has-text("New Application")')).toBeVisible();
    await expect(tlPage.locator('a:has-text("Search Applications")')).toBeVisible();
    await expect(tlPage.locator('a:has-text("Search Business License")')).toBeVisible();
    await expect(tlPage.locator('a:has-text("Renew Business License")')).toBeVisible();
  });

  test('TL-003 | TL home card displays Total and Nearing SLA counters', async ({ tlPage }) => {
    await tlPage.goto('https://unified-demo.digit.org/digit-ui/employee');
    await tlPage.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await expect(tlPage.locator('text=Total')).toBeVisible({ timeout: 15000 });
    await expect(tlPage.locator('text=Nearing SLA')).toBeVisible();
  });

  test('TL-004 | Navigating to /tl/inbox loads Inbox page', async ({ tlPage }) => {
    await tlPage.goto('https://unified-demo.digit.org/digit-ui/employee/tl/inbox');
    await tlPage.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await expect(tlPage).toHaveURL(/\/tl\/inbox/);
    await expect(tlPage.locator('h1, h2').filter({ hasText: /Inbox/ })).toBeVisible({ timeout: 15000 });
  });

  test('TL-005 | Navigating to /tl/new-application loads New Application form', async ({ tlPage }) => {
    await tlPage.goto('https://unified-demo.digit.org/digit-ui/employee/tl/new-application');
    await tlPage.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await expect(tlPage).toHaveURL(/\/tl\/new-application/);
    // Wait for form to render
    await expect(tlPage.locator('text=New Business License Application, text=Business Details')).toBeVisible({ timeout: 20000 });
  });

  test('TL-006 | Navigating to /tl/search/application loads Search Applications page', async ({ tlPage }) => {
    await tlPage.goto('https://unified-demo.digit.org/digit-ui/employee/tl/search/application');
    await tlPage.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await expect(tlPage).toHaveURL(/\/tl\/search\/application/);
    await expect(tlPage.locator('h1, h2').filter({ hasText: /Search/ })).toBeVisible({ timeout: 15000 });
  });

  test('TL-007 | Navigating to /tl/search/license loads Search Business License page', async ({ tlPage }) => {
    await tlPage.goto('https://unified-demo.digit.org/digit-ui/employee/tl/search/license');
    await tlPage.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await expect(tlPage).toHaveURL(/\/tl\/search\/license/);
    await expect(tlPage.locator('h1, h2, text=Search')).toBeVisible({ timeout: 15000 });
  });
});
