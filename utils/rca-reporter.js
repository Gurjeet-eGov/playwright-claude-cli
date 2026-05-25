/**
 * Custom Playwright reporter that enriches the HTML report with
 * Root Cause Analysis (RCA) hints based on error patterns.
 */

const RCA_RULES = [
  {
    pattern: /waiting for.*to be visible/i,
    category: 'Element Not Found',
    rca: 'The target element did not appear within the timeout. Possible causes: (1) selector mismatch after a UI update, (2) slow network / server response, (3) feature flag disabling the element for this role/environment.',
    action: 'Verify the selector against the live DOM. Check network tab for failed API calls that would gate rendering.',
  },
  {
    pattern: /net::ERR_|ERR_CONNECTION|ECONNREFUSED|ERR_NAME_NOT_RESOLVED/i,
    category: 'Network / Connectivity',
    rca: 'The browser could not reach the target host. Possible causes: (1) environment is down, (2) VPN or proxy required, (3) DNS resolution failure.',
    action: 'Confirm the host in config.json is reachable. Run `curl -I <host>` to verify connectivity.',
  },
  {
    pattern: /TimeoutError|Test timeout/i,
    category: 'Timeout',
    rca: 'The test exceeded the configured timeout. Possible causes: (1) page is slow to load, (2) navigation never completed, (3) an assertion waited for a state that never occurred.',
    action: 'Increase timeout in playwright.config.js if this is a known slow page. Otherwise inspect the trace for the last successful step.',
  },
  {
    pattern: /expected.*toHaveURL|expect.*url/i,
    category: 'Navigation Failure',
    rca: 'The page did not navigate to the expected URL. Possible causes: (1) login failed silently, (2) redirect logic changed, (3) missing permission for this role.',
    action: 'Check the screenshot and video attached to this test. Confirm credentials are valid and the role has access to the target page.',
  },
  {
    pattern: /toBeVisible|not.*visible/i,
    category: 'UI Assertion Failure',
    rca: 'An expected UI element was not visible. Possible causes: (1) feature not available in this environment/tenant, (2) data-dependent render (no records to show), (3) selector changed after a UI library upgrade.',
    action: 'Open the HTML report trace. Check if the element exists in DOM but is hidden, or absent entirely.',
  },
  {
    pattern: /toHaveValue|toHaveText|toContain/i,
    category: 'Value / Content Mismatch',
    rca: 'The actual value or text did not match the expected value. Possible causes: (1) test data changed in the environment, (2) localisation key not resolved, (3) default value changed in a config/MDMS update.',
    action: 'Compare expected vs actual in the error message. Check MDMS configuration for default values (Financial Year, License Type etc.).',
  },
  {
    pattern: /Cannot read properties|TypeError|is not a function/i,
    category: 'Test Code Error',
    rca: 'A JavaScript error occurred in the test itself — not in the application. This is a bug in the test code.',
    action: 'Fix the test code: check for null/undefined before accessing properties, ensure fixtures are properly initialised.',
  },
];

function getRCA(errorMessage) {
  if (!errorMessage) return null;
  for (const rule of RCA_RULES) {
    if (rule.pattern.test(errorMessage)) return rule;
  }
  return {
    category: 'Unknown Failure',
    rca: 'No matching RCA pattern found. Review the full error message, screenshot, and trace for manual analysis.',
    action: 'Open the Playwright trace viewer: npx playwright show-trace <trace.zip>',
  };
}

class RcaReporter {
  constructor(options) {
    this.options = options || {};
    this.results = [];
    this.startTime = Date.now();
  }

  onBegin(config, suite) {
    this.totalTests = suite.allTests().length;
    console.log(`\n🚀 Starting ${this.totalTests} TL Business License tests...\n`);
  }

  onTestEnd(test, result) {
    const rca = result.status === 'failed' || result.status === 'timedOut'
      ? getRCA(result.error?.message || '')
      : null;

    this.results.push({
      title: test.title,
      file: test.location?.file?.split('/').slice(-2).join('/') ?? '',
      status: result.status,
      duration: result.duration,
      error: result.error?.message ?? null,
      rca,
      attachments: result.attachments,
    });
  }

  onEnd(result) {
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed' || r.status === 'timedOut').length;
    const skipped = this.results.filter(r => r.status === 'skipped').length;
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(1);

    console.log(`\n${'─'.repeat(60)}`);
    console.log(`  Results: ${passed} passed | ${failed} failed | ${skipped} skipped`);
    console.log(`  Duration: ${duration}s`);
    console.log(`${'─'.repeat(60)}\n`);

    if (failed > 0) {
      console.log('FAILED TESTS WITH RCA:\n');
      this.results
        .filter(r => r.status === 'failed' || r.status === 'timedOut')
        .forEach(r => {
          console.log(`  ✘ ${r.title}`);
          console.log(`    Category : ${r.rca?.category}`);
          console.log(`    RCA      : ${r.rca?.rca}`);
          console.log(`    Action   : ${r.rca?.action}`);
          console.log('');
        });
    }
  }
}

module.exports = RcaReporter;
