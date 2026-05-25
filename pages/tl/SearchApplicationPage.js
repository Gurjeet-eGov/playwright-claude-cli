class SearchApplicationPage {
  constructor(page) {
    this.page = page;
    this.heading = page.locator('h1, h2').filter({ hasText: 'Search Applications' });
    this.applicationNoInput = page.locator('input[name="applicationNumber"]');
    this.licenseNoInput = page.locator('input[name="licenseNumbers"]');
    this.tradeNameInput = page.locator('input[name="tradeName"]');
    this.fromDateInput = page.locator('input[type="date"]').first();
    this.toDateInput = page.locator('input[type="date"]').nth(1);
    this.searchButton = page.locator('button:has-text("Search")').first();
    this.clearAllLink = page.locator('text=CLEAR ALL, text=Clear All, a:has-text("CLEAR")').first();
    this.resultsTable = page.locator('table, [class*="table-container"]');
    this.resultLinks = page.locator('a[href*="/tl/"]').filter({ hasText: /PG-TL-/ });
  }

  async goto() {
    await this.page.goto('/digit-ui/employee/tl/search/application');
    await this.heading.waitFor({ state: 'visible', timeout: 15000 });
  }

  async searchByApplicationNo(appNo) {
    await this.applicationNoInput.fill(appNo);
    await this.searchButton.click();
    await this.page.waitForTimeout(2000);
  }

  async searchByLicenseNo(licNo) {
    await this.licenseNoInput.fill(licNo);
    await this.searchButton.click();
    await this.page.waitForTimeout(2000);
  }

  async searchByTradeName(name) {
    await this.tradeNameInput.fill(name);
    await this.searchButton.click();
    await this.page.waitForTimeout(2000);
  }

  async clearAll() {
    await this.clearAllLink.click();
    await this.page.waitForTimeout(500);
  }
}

module.exports = { SearchApplicationPage };
