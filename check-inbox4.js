const { chromium } = require('@playwright/test');
const path = require('path');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    storageState: path.join(__dirname, 'auth-tl.json'),
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();
  
  const urls = [];
  page.on('framenavigated', frame => {
    if (frame === page.mainFrame()) urls.push(frame.url());
  });
  
  await page.goto('https://unified-demo.digit.org/digit-ui/employee/tl/inbox');
  
  // Wait for root to have children
  await page.waitForFunction(() => document.querySelector('#root')?.children?.length > 0, { timeout: 30000 }).catch(() => {});
  
  // Wait for any subsequent navigation to settle
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(5000);
  
  console.log('Navigation history:', urls.join(' -> '));
  console.log('Final URL:', page.url());
  
  // Get page text
  const pageText = await page.evaluate(() => document.body?.innerText?.slice(0, 500)).catch(() => 'ERROR reading page');
  console.log('Page text:', pageText);
  
  await page.screenshot({ path: 'reports/inbox-check4.png', fullPage: true });
  await browser.close();
}

main().catch(e => console.error('FATAL:', e.message));
