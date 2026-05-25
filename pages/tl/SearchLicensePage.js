class SearchLicensePage {
  constructor(page) {
    this.page = page;
    this.heading = page.locator('h1, h2').filter({ hasText: /Search.*License|License.*Search/i });
    this.licenseNoInput = page.locator('input').filter({ hasText: '' }).nth(1);
    this.mobileInput = page.locator('input[type="text"]').nth(2);
    this.fromDateInput = page.locator('input[type="date"]').first();
    this.toDateInput = page.locator('input[type="date"]').nth(1);
    this.tradeNameInput = page.locator('input[type="text"]').last();
    this.searchButton = page.locator('button:has-text("Search")').first();
    this.clearAllLink = page.locator('text=CLEAR ALL, text=Clear search, a:has-text("CLEAR")').first();
    this.resultLinks = page.locator('a[href*="/tl/"]');
  }

  async goto() {
    await this.page.goto('/digit-ui/employee/tl/search/license');
    await this.heading.waitFor({ state: 'visible', timeout: 15000 });
  }

  async search() {
    await this.searchButton.click();
    await this.page.waitForTimeout(2000);
  }
}

module.exports = { SearchLicensePage };
