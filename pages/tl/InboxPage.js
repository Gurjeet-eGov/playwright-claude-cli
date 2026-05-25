class InboxPage {
  constructor(page) {
    this.page = page;
    this.heading = page.locator('h1, h2').filter({ hasText: 'Inbox' }).first();
    this.applicationNoInput = page.locator('input[name="search"].employee-search-input, input[placeholder="Search"]').first();
    this.mobileInput = page.locator('input[type="text"]').filter({ hasText: '' }).nth(1);
    this.searchButton = page.locator('button:has-text("Search"), button.submit-bar-search').first();
    this.clearSearchLink = page.locator('text=Clear Search');
    this.assignedToMeRadio = page.locator('label:has-text("Assigned to Me"), input[type="radio"]').first();
    this.assignedToAllRadio = page.locator('label:has-text("Assigned to All"), input[type="radio"]').nth(1);
    this.applyFilterButton = page.locator('button:has-text("Apply"), button.submit-bar-disabled, button.submit-bar').first();
    this.tableRows = page.locator('table tbody tr, [class*="table"] [class*="row"]');
    this.applicationLinks = page.locator('a[href*="/tl/"]').filter({ hasText: /PG-TL-/ });
    this.rowsPerPageSelect = page.locator('select.cp');
    this.navLinks = {
      newApplication: page.locator('a:has-text("New Application")').first(),
      searchApplications: page.locator('a:has-text("Search Applications")').first(),
      searchLicense: page.locator('a:has-text("Search Business License")').first(),
      renewLicense: page.locator('a:has-text("Renew Business License")').first(),
    };
  }

  async goto() {
    await this.page.goto('/digit-ui/employee/tl/inbox');
    await this.heading.waitFor({ state: 'visible', timeout: 15000 });
  }

  async searchByApplicationNo(appNo) {
    await this.applicationNoInput.fill(appNo);
    await this.searchButton.click();
    await this.page.waitForTimeout(1500);
  }

  async clearSearch() {
    await this.clearSearchLink.click();
    await this.page.waitForTimeout(500);
  }

  async getApplicationCount() {
    const text = await this.heading.textContent();
    const match = text.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  }
}

module.exports = { InboxPage };
