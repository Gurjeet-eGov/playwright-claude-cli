class HomePage {
  constructor(page) {
    this.page = page;
    // Partial text match — works even when title wraps across lines in the DOM
    this.tlCardTitle = page.locator('[class*="card"] h3, [class*="card"] h2, [class*="card"] p').filter({ hasText: /Business License|Local Business/ }).first();
    this.inboxLink = page.locator('a:has-text("Inbox"), span:has-text("Inbox")').first();
    this.newApplicationLink = page.locator('a:has-text("New Application")').first();
    this.searchApplicationsLink = page.locator('a:has-text("Search Applications")').first();
    this.searchLicenseLink = page.locator('a:has-text("Search Business License")').first();
    this.renewLicenseLink = page.locator('a:has-text("Renew Business License")').first();
  }

  async goto() {
    await this.page.goto('/digit-ui/employee');
    await this.page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await this.page.waitForSelector('[class*="card"], a:has-text("Inbox")', { timeout: 20000 });
  }

  async navigateToInbox() {
    await this.page.goto('/digit-ui/employee/tl/inbox');
    await this.page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  }

  async navigateToNewApplication() {
    await this.page.goto('/digit-ui/employee/tl/new-application');
    await this.page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  }

  async navigateToSearchApplications() {
    await this.page.goto('/digit-ui/employee/tl/search/application');
    await this.page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  }

  async navigateToSearchLicense() {
    await this.page.goto('/digit-ui/employee/tl/search/license');
    await this.page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  }
}

module.exports = { HomePage };
