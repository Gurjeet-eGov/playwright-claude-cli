const config = require('../config.json');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.cityDropdownTrigger = page.locator('.employee-select-wrap--elipses');
    this.cityOptionsContainer = page.locator('#jk-dropdown-unique');
    this.submitButton = page.locator('button[type="submit"]');
  }

  async goto() {
    await this.page.goto('/digit-ui/employee/user/login');
    await this.usernameInput.waitFor({ state: 'visible', timeout: 15000 });
  }

  async login(username, password, cityLabel) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.cityDropdownTrigger.click();
    await this.cityOptionsContainer.waitFor({ state: 'visible', timeout: 5000 });
    // Click the city option that matches the label (case-insensitive partial)
    const option = this.page.locator('#jk-dropdown-unique .profile-dropdown--item').filter({ hasText: cityLabel });
    await option.first().click();
    await this.submitButton.click();
    await this.page.waitForURL(url => !url.toString().includes('/user/login'), { timeout: 20000 });
  }

  async loginWithCredentials(creds) {
    // derive city label from tenantId (e.g. pg.citya → "citya")
    const tenantParts = (creds.tenantId || '').split('.');
    const cityCode = tenantParts[tenantParts.length - 1] ?? config.cityCode;
    // map known city codes to display labels
    const cityLabelMap = {
      citya: 'Victoria City',
      statea: 'State Demo',
    };
    const cityLabel = cityLabelMap[cityCode] ?? cityCode;
    await this.login(creds.username, creds.password, cityLabel);
  }
}

module.exports = { LoginPage };
