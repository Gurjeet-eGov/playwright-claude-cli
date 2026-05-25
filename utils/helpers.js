/**
 * Waits for a network response matching the given URL pattern and returns parsed JSON.
 */
async function waitForApiResponse(page, urlPattern, triggerFn) {
  const [response] = await Promise.all([
    page.waitForResponse(res => res.url().includes(urlPattern) && res.status() === 200),
    triggerFn(),
  ]);
  return response.json();
}

/**
 * Retries a locator click until it succeeds or maxAttempts is reached.
 */
async function retryClick(locator, maxAttempts = 3) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await locator.click({ timeout: 5000 });
      return;
    } catch {
      if (i === maxAttempts - 1) throw new Error(`Click failed after ${maxAttempts} attempts`);
    }
  }
}

/**
 * Generates a unique string with an optional prefix (useful for test data).
 */
function uniqueId(prefix = 'test') {
  return `${prefix}_${Date.now()}`;
}

module.exports = { waitForApiResponse, retryClick, uniqueId };