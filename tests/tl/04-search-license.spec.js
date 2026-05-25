/**
 * TL-023 to TL-026 — Search Business License
 * Optimised from: BL/182–BL/199
 */
const { test, expect } = require('../../fixtures/tl-base');

const SEARCH_LIC_URL = 'https://unified-demo.digit.org/digit-ui/employee/tl/search/license';

test.describe('TL — Search Business License', () => {

  test.beforeEach(async ({ tlPage }) => {
    await tlPage.goto(SEARCH_LIC_URL);
    await tlPage.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await tlPage.waitForTimeout(2000);
  });

  test('TL-023 | Search Business License page loads with heading and Search button', async ({ tlPage }) => {
    const heading = tlPage.locator('h1, h2').filter({ hasText: /Search|License/i }).first();
    await expect(heading).toBeVisible({ timeout: 15000 });
    await expect(tlPage.locator('button:has-text("Search")')).toBeVisible();
  });

  test('TL-024 | Page has date range fields and at least one text input', async ({ tlPage }) => {
    await expect(tlPage.locator('input[type="date"]').first()).toBeVisible({ timeout: 10000 });
    // At least one text input (license number or mobile)
    const textInputs = tlPage.locator('input[type="text"]').filter({ has: tlPage.locator('input.employee-card-input, input[class*="card-input"]') });
    const count = await tlPage.locator('input.employee-card-input, input[class*="card-input"]').count();
    expect(count).toBeGreaterThan(0);
  });

  test('TL-025 | Search returns results or no-records message', async ({ tlPage }) => {
    await tlPage.locator('button:has-text("Search")').click();
    await tlPage.waitForTimeout(3000);
    const hasResults = (await tlPage.locator('a').filter({ hasText: /PG-TL-/ }).count()) > 0;
    const noData = (await tlPage.locator('text=No records, text=No data, text=0 records').count()) > 0;
    expect(hasResults || noData).toBeTruthy();
  });

  test('TL-026 | Breadcrumb shows Home link', async ({ tlPage }) => {
    await expect(tlPage.locator('a:has-text("Home"), text=Home')).toBeVisible({ timeout: 10000 });
  });
});
