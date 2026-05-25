const { chromium } = require('@playwright/test');
const path = require('path');

async function main() {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const context = await browser.newContext({
    storageState: path.join(__dirname, 'auth-tl.json'),
    ignoreHTTPSErrors: true,
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();
  
  await page.goto('https://unified-demo.digit.org/digit-ui/employee/tl/inbox');
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(5000);
  
  console.log('URL:', page.url());
  const domCount = await page.evaluate(() => document.querySelectorAll('*').length);
  console.log('DOM elements:', domCount);
  const pageText = await page.evaluate(() => document.body?.innerText?.slice(0, 500)).catch(() => 'error');
  console.log('Page text:', pageText);

  await page.screenshot({ path: 'reports/inbox-headed.png', fullPage: true });
  await browser.close();
}

main().catch(e => console.error('FATAL:', e.message));
