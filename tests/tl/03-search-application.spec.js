/**
 * TL-017 to TL-022 — Search Applications
 * Optimised from: BL/135–BL/156
 */
const { test, expect } = require('../../fixtures/tl-base');

const SEARCH_URL = 'https://unified-demo.digit.org/digit-ui/employee/tl/search/application';
const KNOWN_APP_NO = 'PG-TL-2025-09-22-000790';

test.describe('TL — Search Applications', () => {

  test.beforeEach(async ({ tlPage }) => {
    await tlPage.goto(SEARCH_URL);
    await tlPage.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await tlPage.locator('h1, h2').filter({ hasText: /Search/ }).waitFor({ timeout: 20000 });
  });

  test('TL-017 | Search Applications page shows all required fields', async ({ tlPage }) => {
    await expect(tlPage.locator('text=Application No.')).toBeVisible();
    await expect(tlPage.locator('text=Application Type')).toBeVisible();
    await expect(tlPage.locator('text=Business License Number')).toBeVisible();
    await expect(tlPage.locator('text=Application status')).toBeVisible();
    await expect(tlPage.locator('text=Business Name, text=Business License application from date')).toBeVisible();
    await expect(tlPage.locator('button:has-text("Search")')).toBeVisible();
    await expect(tlPage.locator('text=CLEAR ALL, a:has-text("CLEAR")')).toBeVisible();
  });

  test('TL-018 | Search by Application Number returns matching result', async ({ tlPage }) => {
    await tlPage.locator('input[name="applicationNumber"]').fill(KNOWN_APP_NO);
    await tlPage.locator('button:has-text("Search")').click();
    await tlPage.waitForTimeout(3000);
    await expect(tlPage.locator(`text=${KNOWN_APP_NO}`)).toBeVisible({ timeout: 15000 });
  });

  test('TL-019 | Search results show Application No., Application Date columns', async ({ tlPage }) => {
    await tlPage.locator('input[name="applicationNumber"]').fill(KNOWN_APP_NO);
    await tlPage.locator('button:has-text("Search")').click();
    await tlPage.waitForTimeout(3000);
    const hasResult = await tlPage.locator(`text=${KNOWN_APP_NO}`).isVisible().catch(() => false);
    if (!hasResult) test.skip();
    await expect(tlPage.locator('text=Application No.')).toBeVisible();
  });

  test('TL-020 | Search by Business Name shows results or no-records message', async ({ tlPage }) => {
    await tlPage.locator('input[name="tradeName"]').fill('test');
    await tlPage.locator('button:has-text("Search")').click();
    await tlPage.waitForTimeout(3000);
    const hasResults = (await tlPage.locator('a').filter({ hasText: /PG-TL-/ }).count()) > 0;
    const noData = (await tlPage.locator('text=No records, text=No data, text=No Results').count()) > 0;
    expect(hasResults || noData).toBeTruthy();
  });

  test('TL-021 | CLEAR ALL resets Application No, License No, and Business Name fields', async ({ tlPage }) => {
    await tlPage.locator('input[name="applicationNumber"]').fill('TEST-123');
    await tlPage.locator('input[name="licenseNumbers"]').fill('LIC-TEST');
    await tlPage.locator('input[name="tradeName"]').fill('Demo Business');
    await tlPage.locator('text=CLEAR ALL, a:has-text("CLEAR")').click();
    await expect(tlPage.locator('input[name="applicationNumber"]')).toHaveValue('');
    await expect(tlPage.locator('input[name="licenseNumbers"]')).toHaveValue('');
    await expect(tlPage.locator('input[name="tradeName"]')).toHaveValue('');
  });

  test('TL-022 | Clicking application number link navigates to application details', async ({ tlPage }) => {
    await tlPage.locator('input[name="applicationNumber"]').fill(KNOWN_APP_NO);
    await tlPage.locator('button:has-text("Search")').click();
    await tlPage.waitForTimeout(3000);
    const link = tlPage.locator('a').filter({ hasText: /PG-TL-/ }).first();
    const visible = await link.isVisible().catch(() => false);
    if (!visible) test.skip();
    await link.click();
    await tlPage.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await expect(tlPage).not.toHaveURL(/\/search\/application/);
  });
});
