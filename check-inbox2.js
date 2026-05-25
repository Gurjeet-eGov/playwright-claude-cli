const { chromium } = require('@playwright/test');
const path = require('path');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    storageState: path.join(__dirname, 'auth-tl.json'),
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();
  
  // Log console errors
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('CONSOLE ERROR:', msg.text().slice(0,200));
  });
  
  await page.goto('https://unified-demo.digit.org/digit-ui/employee/tl/inbox');
  await page.waitForTimeout(8000); // longer wait
  
  console.log('URL:', page.url());
  
  // Check total DOM elements
  const domCount = await page.evaluate(() => document.querySelectorAll('*').length);
  console.log('DOM elements count:', domCount);
  
  // Check body content
  const bodyHTML = await page.evaluate(() => document.body?.innerHTML?.slice(0, 2000) || 'NO BODY');
  console.log('Body (first 2000):', bodyHTML);
  
  await page.screenshot({ path: 'reports/inbox-check2.png', fullPage: true });
  await browser.close();
}

main().catch(console.error);
