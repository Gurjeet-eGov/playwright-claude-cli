# playwright-claude-cli

AI-assisted Playwright automation test suite for eGov applications (mSeva / Punjab ULB platform).
Tests are written and maintained by Claude Code; humans review, approve, and extend them.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setup](#setup)
3. [Project Structure](#project-structure)
4. [Configuration](#configuration)
5. [Running Tests](#running-tests)
6. [Viewing Reports](#viewing-reports)
7. [Framework Architecture](#framework-architecture)
8. [Writing New Tests](#writing-new-tests)
9. [CI/CD Integration](#cicd-integration)

---

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | v18+ | v24 recommended — already installed via nvm |
| npm | v9+ | ships with Node |
| Git | any | for version control |

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/Gurjeet-eGov/playwright-claude-cli.git
cd playwright-claude-cli
```

### 2. Install Node dependencies

```bash
npm install
```

### 3. Install Playwright browser(s)

```bash
# Chromium only (default, ~113 MB)
npx playwright install chromium

# All browsers (Chromium + Firefox + WebKit, ~300 MB)
npx playwright install
```

> On Linux, you may also need system dependencies the first time:
> ```bash
> npx playwright install --with-deps chromium
> ```
> This requires `sudo`. If unavailable, install the packages listed by
> `npx playwright install-deps --dry-run` manually.

### 4. Configure credentials

Edit `config.json` and fill in the real credentials and host URL:

```json
{
  "host": "https://mseva.lgpunjab.gov.in",
  "credentials": {
    "PGR": {
      "CSR": { "username": "...", "password": "...", "tenantId": "pb.testing", "type": "Employee" },
      "GRO": { "username": "...", "password": "...", "tenantId": "pb.testing", "type": "Employee" }
    }
  }
}
```

> `config.json` is committed with placeholder values. **Never commit real passwords.**
> Use a `.env` file or CI secrets for production credentials and load them with `dotenv` if needed.

---

## Project Structure

```
playwright-claude-cli/
├── config.json               # Environment config: host, credentials (no secrets in git)
├── playwright.config.js      # Playwright runner configuration
├── package.json
│
├── fixtures/
│   └── base.js               # Custom test fixtures (appConfig, authenticatedPage)
│
├── pages/                    # Page Object Model (POM)
│   └── LoginPage.js          # Selectors + actions for the login screen
│
├── tests/
│   ├── smoke/                # Fast sanity checks — run on every PR
│   │   └── login.spec.js
│   ├── regression/           # Full regression suite — run nightly
│   └── e2e/                  # End-to-end user journey tests
│
├── utils/
│   └── helpers.js            # Shared utilities: waitForApiResponse, retryClick, uniqueId
│
└── reports/                  # Generated at runtime, git-ignored
    ├── html/                 # Interactive HTML report (npx playwright show-report)
    ├── results.json          # Machine-readable JSON results
    └── test-results/         # Screenshots, videos, traces on failure
```

---

## Configuration

`playwright.config.js` central settings:

| Setting | Default | Description |
|---------|---------|-------------|
| `timeout` | 60 000 ms | Per-test timeout |
| `expect.timeout` | 10 000 ms | Per-assertion timeout |
| `retries` | 0 (local) / 1 (CI) | Retry flaky tests on CI |
| `workers` | 2 (local) / 1 (CI) | Parallel workers |
| `screenshot` | on failure | Saved to `reports/test-results/` |
| `video` | on failure | Saved to `reports/test-results/` |
| `trace` | on failure | Open with `npx playwright show-trace` |

---

## Running Tests

```bash
# All tests
npm test

# Smoke tests only
npm run test:smoke

# Run with browser visible (headed mode)
npm run test:headed

# Step-by-step debugger (Playwright Inspector)
npm run test:debug

# Run a single spec file
npx playwright test tests/smoke/login.spec.js

# Run tests matching a title pattern
npx playwright test --grep "CSR employee"

# Run against a different host
HOST=https://staging.example.com npx playwright test
```

---

## Viewing Reports

```bash
# Open the last HTML report in a browser
npm run report
```

The HTML report provides:
- Pass/fail per test with duration
- Screenshots and videos on failure
- Full trace viewer (network, DOM snapshots, console logs)

---

## Framework Architecture

### Design principles

**Page Object Model (POM)**
Each screen or component has a dedicated class in `pages/`. Tests never contain raw locators — they call named methods. This makes tests resilient to UI selector changes: fix one place, all tests benefit.

**Fixtures (`fixtures/base.js`)**
Playwright's fixture system replaces beforeEach/afterEach boilerplate. The `appConfig` fixture injects parsed `config.json` into every test. The `authenticatedPage` fixture logs in automatically for tests that need it, using credentials keyed by `moduleKey` + `roleKey`.

**Utilities (`utils/helpers.js`)**
Reusable helpers for cross-cutting concerns: waiting for API responses, retrying flaky clicks, and generating unique test data IDs.

**Test organisation**

| Folder | Purpose | Trigger |
|--------|---------|---------|
| `tests/smoke/` | Does the app start and accept logins? | Every commit / PR |
| `tests/regression/` | All documented acceptance criteria | Nightly + pre-release |
| `tests/e2e/` | Full user journeys across modules | Pre-release |

**Reporting**
Three reporters run in parallel:
- `list` — inline terminal output
- `html` — interactive report with traces (`reports/html/`)
- `json` — machine-readable for CI dashboards (`reports/results.json`)

**Credential management**
`config.json` is the single source of truth for hosts and credential *shapes*. Actual secrets must be injected via environment variables or a secrets manager in CI — never hard-coded.

### How Claude Code generates tests

1. You describe the feature or user flow to test (in plain English or a ticket reference).
2. Claude Code reads the relevant pages, inspects the DOM where needed, and writes a spec file + any new Page Object methods.
3. The tests run immediately; failures are diagnosed and fixed in the same session.
4. The final passing spec is committed for humans to review.

---

## Writing New Tests

### Minimal test template

```js
const { test, expect } = require('../../fixtures/base');
const { LoginPage } = require('../../pages/LoginPage');

test.describe('Feature - Scenario group', () => {
  test('should do something expected', async ({ page, appConfig }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Act
    await loginPage.login(appConfig.credentials.PGR.CSR.username,
                          appConfig.credentials.PGR.CSR.password);

    // Assert
    await expect(page).toHaveURL(/dashboard/i);
  });
});
```

### Adding a new Page Object

```js
// pages/MyFeaturePage.js
class MyFeaturePage {
  constructor(page) {
    this.page = page;
    this.submitButton = page.getByRole('button', { name: 'Submit' });
  }

  async submit() {
    await this.submitButton.click();
  }
}
module.exports = { MyFeaturePage };
```

---

## CI/CD Integration

Add a GitHub Actions workflow (`.github/workflows/playwright.yml`):

```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm test
        env:
          CI: true
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: reports/html/
          retention-days: 14
```

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `Error: browserType.launch: Executable doesn't exist` | Run `npx playwright install chromium` |
| `sudo: a terminal is required` during `--with-deps` | Install OS deps manually: `sudo npx playwright install-deps chromium` in a real terminal |
| Tests time out on login | Check `config.json` host URL and credentials; run `--headed` to watch |
| `Cannot find module '../../fixtures/base'` | Ensure test file is inside `tests/<subfolder>/` |
