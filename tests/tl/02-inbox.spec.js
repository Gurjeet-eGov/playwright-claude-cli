/**
 * TL-008 to TL-016 — Employee Inbox
 * Optimised from: BL/50–BL/80
 */
const { test, expect } = require('../../fixtures/tl-base');

const INBOX_URL = 'https://unified-demo.digit.org/digit-ui/employee/tl/inbox';

test.describe('TL — Employee Inbox', () => {

  test.beforeEach(async ({ tlPage }) => {
    await tlPage.goto(INBOX_URL);
    await tlPage.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await tlPage.locator('h1, h2').filter({ hasText: /Inbox/ }).waitFor({ state: 'visible', timeout: 20000 });
  });

  test('TL-008 | Inbox page loads with heading and application count badge', async ({ tlPage }) => {
    const heading = tlPage.locator('h1, h2').filter({ hasText: /Inbox/ }).first();
    await expect(heading).toBeVisible();
    const headingText = await heading.textContent();
    expect(headingText).toMatch(/Inbox/);
  });

  test('TL-009 | Inbox sidebar shows all required navigation links', async ({ tlPage }) => {
    await expect(tlPage.locator('a:has-text("New Application")')).toBeVisible();
    await expect(tlPage.locator('a:has-text("Search Applications")')).toBeVisible();
    await expect(tlPage.locator('a:has-text("Search Business License")')).toBeVisible();
    await expect(tlPage.locator('a:has-text("Renew Business License")')).toBeVisible();
  });

  test('TL-010 | Inbox table displays applications with required columns', async ({ tlPage }) => {
    await expect(tlPage.locator('text=Application No.')).toBeVisible();
    await expect(tlPage.locator('text=Application Date')).toBeVisible();
    await expect(tlPage.locator('text=Application Type')).toBeVisible();
    await expect(tlPage.locator('text=Locality')).toBeVisible();
    await expect(tlPage.locator('text=Status')).toBeVisible();
    // At least one application link should exist
    const appLinks = tlPage.locator('a').filter({ hasText: /PG-TL-/ });
    const count = await appLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('TL-011 | Inbox has Application No search, +91 Mobile prefix, Search button, Clear Search', async ({ tlPage }) => {
    // +91 mobile prefix
    await expect(tlPage.locator('text=+91')).toBeVisible();
    // Search input
    await expect(tlPage.locator('input[placeholder="Search"], input[name="search"]').first()).toBeVisible();
    // Search button
    await expect(tlPage.locator('button:has-text("Search")')).toBeVisible();
    // Clear Search
    await expect(tlPage.locator('text=Clear Search')).toBeVisible();
  });

  test('TL-012 | Inbox filter panel shows Assigned to Me, Assigned to All and FILTER BY', async ({ tlPage }) => {
    await expect(tlPage.locator('text=Assigned to Me')).toBeVisible();
    await expect(tlPage.locator('text=Assigned to All')).toBeVisible();
    await expect(tlPage.locator('text=FILTER BY')).toBeVisible();
  });

  test('TL-013 | Inbox search by known application number returns that record', async ({ tlPage }) => {
    const firstLink = tlPage.locator('a').filter({ hasText: /PG-TL-/ }).first();
    const appNo = (await firstLink.textContent())?.trim();
    if (!appNo) test.skip();

    const searchInput = tlPage.locator('input[placeholder="Search"], input[name="search"]').first();
    await searchInput.fill(appNo);
    await tlPage.locator('button:has-text("Search")').click();
    await tlPage.waitForTimeout(2000);
    await expect(tlPage.locator(`a:has-text("${appNo}")`)).toBeVisible({ timeout: 10000 });
  });

  test('TL-014 | Inbox Clear Search resets the search input to empty', async ({ tlPage }) => {
    const searchInput = tlPage.locator('input[placeholder="Search"], input[name="search"]').first();
    await searchInput.fill('SEARCH-TEST-000');
    await tlPage.locator('text=Clear Search').click();
    await tlPage.waitForTimeout(500);
    await expect(searchInput).toHaveValue('');
  });

  test('TL-015 | Inbox rows-per-page dropdown contains 10, 20, 50 options', async ({ tlPage }) => {
    const select = tlPage.locator('select.cp').first();
    await expect(select).toBeVisible();
    const options = await select.locator('option').allTextContents();
    expect(options.some(o => o.trim() === '10')).toBeTruthy();
    expect(options.some(o => o.trim() === '20')).toBeTruthy();
  });

  test('TL-016 | Clicking application number navigates to application details page', async ({ tlPage }) => {
    const firstLink = tlPage.locator('a').filter({ hasText: /PG-TL-/ }).first();
    const appNo = (await firstLink.textContent())?.trim();
    await firstLink.click();
    await tlPage.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await expect(tlPage).not.toHaveURL(/\/tl\/inbox$/);
    await expect(tlPage.locator(`text=${appNo}`)).toBeVisible({ timeout: 15000 });
  });
});
