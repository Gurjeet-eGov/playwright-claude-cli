/**
 * TL-027 to TL-038 — New Business License Application Form
 * Optimised from: BL/82–BL/134
 */
const { test, expect } = require('../../fixtures/tl-base');

const NEW_APP_URL = 'https://unified-demo.digit.org/digit-ui/employee/tl/new-application';

// Navigate to the form via the sidebar link (ensures React hydration)
async function goToNewApp(page) {
  await page.goto('https://unified-demo.digit.org/digit-ui/employee/tl/inbox');
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  await page.locator('a:has-text("New Application")').first().click();
  await page.waitForURL(/\/tl\/new-application/, { timeout: 15000 });
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  // Wait for the form to hydrate
  await page.locator('text=Business Details, text=New Business License').waitFor({ timeout: 25000 });
}

test.describe('TL — New Business License Application', () => {

  test('TL-027 | New Application page loads with correct heading and URL', async ({ tlPage }) => {
    await goToNewApp(tlPage);
    await expect(tlPage).toHaveURL(/\/tl\/new-application/);
    await expect(tlPage.locator('text=New Business License Application')).toBeVisible();
  });

  test('TL-028 | Business Details section has Financial Year, License Type, Business Name, Structure Type fields', async ({ tlPage }) => {
    await goToNewApp(tlPage);
    await expect(tlPage.locator('text=Business Details')).toBeVisible();
    await expect(tlPage.locator('text=Financial Year')).toBeVisible();
    await expect(tlPage.locator('text=License Type')).toBeVisible();
    await expect(tlPage.locator('text=Business Name')).toBeVisible();
    await expect(tlPage.locator('text=Structure Type')).toBeVisible();
    await expect(tlPage.locator('text=Structure Sub Type')).toBeVisible();
    await expect(tlPage.locator('text=Business Commencement Date')).toBeVisible();
  });

  test('TL-029 | Financial Year defaults to current FY; License Type shows Permanent and is locked', async ({ tlPage }) => {
    await goToNewApp(tlPage);
    // Financial year dropdown should show a valid FY value
    const fyInput = tlPage.locator('.employee-select-wrap--elipses').nth(0);
    const fyValue = await fyInput.inputValue();
    expect(fyValue).toMatch(/FY\d{4}/i);
    // License Type should be disabled / show Permanent
    const ltInput = tlPage.locator('.employee-select-wrap--elipses.disabled').first();
    const ltValue = await ltInput.inputValue();
    expect(ltValue.toLowerCase()).toContain('permanent');
    expect(await ltInput.isDisabled()).toBe(true);
  });

  test('TL-030 | Business Units sub-section has Category, Type, Sub Type, UOM, Add Unit button', async ({ tlPage }) => {
    await goToNewApp(tlPage);
    await expect(tlPage.locator('text=Business Units')).toBeVisible();
    await expect(tlPage.locator('text=Business Category')).toBeVisible();
    await expect(tlPage.locator('text=Business Type')).toBeVisible();
    await expect(tlPage.locator('text=Business Sub Type')).toBeVisible();
    await expect(tlPage.locator('text=UOM').first()).toBeVisible();
    await expect(tlPage.locator('text=UOM Value').first()).toBeVisible();
    await expect(tlPage.locator('text=Add Business Unit')).toBeVisible();
  });

  test('TL-031 | Accessories section has Accessories dropdown, UOM, Count, Add Accessories button', async ({ tlPage }) => {
    await goToNewApp(tlPage);
    await expect(tlPage.locator('text=Accessories').first()).toBeVisible();
    await expect(tlPage.locator('text=Accessory Count')).toBeVisible();
    await expect(tlPage.locator('text=Add Accessories')).toBeVisible();
  });

  test('TL-032 | Business Address section has Pincode, City, Locality, Building No, Street Name', async ({ tlPage }) => {
    await goToNewApp(tlPage);
    await expect(tlPage.locator('text=Business Address')).toBeVisible();
    await expect(tlPage.locator('text=Pincode')).toBeVisible();
    await expect(tlPage.locator('text=City')).toBeVisible();
    await expect(tlPage.locator('text=Locality')).toBeVisible();
    await expect(tlPage.locator('input#doorNo')).toBeVisible();
    await expect(tlPage.locator('input#street')).toBeVisible();
  });

  test('TL-033 | Ownership Details section has Type, Owner Name, Mobile with +91 prefix', async ({ tlPage }) => {
    await goToNewApp(tlPage);
    await expect(tlPage.locator('text=Ownership Details')).toBeVisible();
    await expect(tlPage.locator('text=Type Of ownership')).toBeVisible();
    await expect(tlPage.locator("text=Owner's Name")).toBeVisible();
    await expect(tlPage.locator("text=Owner's Mobile Number")).toBeVisible();
    await expect(tlPage.locator('text=+91')).toBeVisible();
  });

  test('TL-034 | Documents Required section has Ownership Proof and Registration Certificate upload fields', async ({ tlPage }) => {
    await goToNewApp(tlPage);
    await expect(tlPage.locator('text=Documents Required')).toBeVisible();
    await expect(tlPage.locator('text=Ownership Proof')).toBeVisible();
    await expect(tlPage.locator('text=Registration Certificate')).toBeVisible();
    await expect(tlPage.locator('input[type="file"]').first()).toBeAttached();
  });

  test('TL-035 | Business Name field accepts and retains text input', async ({ tlPage }) => {
    await goToNewApp(tlPage);
    const businessNameInput = tlPage.locator('input.employee-card-input').first();
    await businessNameInput.fill('Sunrise Electronics');
    await expect(businessNameInput).toHaveValue('Sunrise Electronics');
  });

  test('TL-036 | Building Number (doorNo) and Street Name fields accept special characters', async ({ tlPage }) => {
    await goToNewApp(tlPage);
    await tlPage.locator('input#doorNo').fill('B-12/A');
    await tlPage.locator('input#street').fill('MG Road, Sector-3');
    await expect(tlPage.locator('input#doorNo')).toHaveValue('B-12/A');
    await expect(tlPage.locator('input#street')).toHaveValue('MG Road, Sector-3');
  });

  test('TL-037 | Submit button is disabled on empty form', async ({ tlPage }) => {
    await goToNewApp(tlPage);
    const submitBtn = tlPage.locator('button:has-text("Submit")');
    await expect(submitBtn).toBeVisible();
    const cls = await submitBtn.getAttribute('class') ?? '';
    const isDisabled = cls.includes('disabled') || await submitBtn.isDisabled().catch(() => false);
    expect(isDisabled).toBe(true);
  });

  test('TL-038 | Property section has Search Property and Create Property options', async ({ tlPage }) => {
    await goToNewApp(tlPage);
    await expect(tlPage.locator('text=Search Property')).toBeVisible();
    await expect(tlPage.locator('text=Create Property')).toBeVisible();
  });
});
