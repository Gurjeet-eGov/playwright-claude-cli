const { chromium } = require('@playwright/test');
const path = require('path');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    storageState: path.join(__dirname, 'auth-tl.json'),
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('ERROR:', msg.text().slice(0,150));
  });
  
  await page.goto('https://unified-demo.digit.org/digit-ui/employee/tl/inbox');
  
  // Wait for React to mount — wait for #root to have children
  try {
    await page.waitForFunction(() => document.querySelector('#root')?.children?.length > 0, { timeout: 30000 });
    console.log('#root has children now');
  } catch(e) {
    console.log('#root still empty after 30s');
  }
  
  console.log('URL:', page.url());
  
  const domCount = await page.evaluate(() => document.querySelectorAll('*').length);
  console.log('DOM elements after hydration:', domCount);
  
  // Get text content of the page
  const pageText = await page.evaluate(() => document.body?.innerText?.slice(0, 1000));
  console.log('Page text:', pageText);
  
  // Check heading tags
  const headings = await page.evaluate(() => {
    return [...document.querySelectorAll('h1,h2,h3,h4,h5,h6,[class*="heading"],[class*="title"]')]
      .map(el => `${el.tagName}.${el.className.slice(0,30)}: "${el.textContent?.trim().slice(0,60)}"`)
      .slice(0,20);
  });
  console.log('Headings/titles:', headings.join('\n'));
  
  await page.screenshot({ path: 'reports/inbox-check3.png', fullPage: true });
  await browser.close();
}

main().catch(console.error);
