const { test, expect } = require('../../fixtures/base');
const { LoginPage } = require('../../pages/LoginPage');

test.describe('Login - Smoke Tests', () => {
  test('PT superuser can log in', async ({ page, appConfig }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithCredentials(appConfig.credentials.PT.SU);
    await expect(page).not.toHaveURL(/\/user\/login/);
  });

  test('TL superuser can log in', async ({ page, appConfig }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithCredentials(appConfig.credentials.TL.SU);
    await expect(page).not.toHaveURL(/\/user\/login/);
  });

  test('Employee login page loads', async ({ page }) => {
    await page.goto('/digit-ui/employee/user/login');
    await expect(page).toHaveTitle(/.+/);
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });
});
