class NewApplicationPage {
  constructor(page) {
    this.page = page;
    this.heading = page.locator('h1, h2').filter({ hasText: /New Business License/ });
    // Business Details section
    this.financialYearDropdown = page.locator('.employee-select-wrap--elipses').nth(0);
    this.licenseTypeDropdown = page.locator('.employee-select-wrap--elipses.disabled').first();
    this.businessNameInput = page.locator('input.employee-card-input').first();
    this.structureTypeDropdown = page.locator('.employee-select-wrap--elipses').nth(2);
    this.structureSubTypeDropdown = page.locator('.employee-select-wrap--elipses').nth(3);
    this.commencementDateInput = page.locator('input[type="date"]');
    this.gstInput = page.locator('input.employee-card-input').nth(1);
    this.operationalAreaInput = page.locator('input.employee-card-input').nth(2);
    this.employeeCountInput = page.locator('input.employee-card-input').nth(3);
    // Business Units
    this.businessCategoryDropdown = page.locator('.employee-select-wrap--elipses').nth(4);
    // Address
    this.buildingNoInput = page.locator('input#doorNo');
    this.streetInput = page.locator('input#street');
    // Ownership
    this.ownerNameInput = page.locator('input.employee-card-input').nth(10);
    this.mobileNumberInput = page.locator('input.employee-card-input').nth(11);
    // Submit
    this.submitButton = page.locator('button:has-text("Submit")');
    // Section headers
    this.businessDetailsSection = page.locator('text=Business Details');
    this.businessUnitsSection = page.locator('text=Business Units');
    this.ownershipSection = page.locator('text=Ownership Details');
    this.documentsSection = page.locator('text=Documents Required');
  }

  async goto() {
    await this.page.goto('/digit-ui/employee/tl/new-application');
    await this.heading.waitFor({ state: 'visible', timeout: 20000 });
  }

  async fillBusinessName(name) {
    await this.businessNameInput.fill(name);
  }

  async getFinancialYearValue() {
    return this.financialYearDropdown.inputValue();
  }

  async getLicenseTypeValue() {
    return this.licenseTypeDropdown.inputValue();
  }

  async isLicenseTypeDisabled() {
    return this.licenseTypeDropdown.isDisabled();
  }

  async clickSubmit() {
    await this.submitButton.click();
    await this.page.waitForTimeout(2000);
  }

  async isSubmitDisabled() {
    const cls = await this.submitButton.getAttribute('class') ?? '';
    return cls.includes('disabled') || await this.submitButton.isDisabled();
  }
}

module.exports = { NewApplicationPage };
