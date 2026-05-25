const { chromium } = require('@playwright/test');
const path = require('path');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    storageState: path.join(__dirname, 'auth-tl.json'),
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();
  await page.goto('https://unified-demo.digit.org/digit-ui/employee/tl/inbox');
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(3000);
  
  console.log('Current URL:', page.url());
  
  const headings = await page.evaluate(() => {
    const all = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')];
    return all.map(el => `${el.tagName}: "${el.textContent?.trim()?.slice(0,80)}"`);
  });
  console.log('Headings:', headings.length ? headings.join('\n') : 'NONE');
  
  const inboxEls = await page.evaluate(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const results = [];
    let node;
    while ((node = walker.nextNode())) {
      const txt = node.textContent?.trim();
      if (txt && txt.toLowerCase().includes('inbox')) {
        const el = node.parentElement;
        results.push(`${el?.tagName}.${(el?.className||'').replace(/\s+/g,' ').slice(0,50)}: "${txt.slice(0,60)}"`);
      }
    }
    return results.slice(0, 20);
  });
  console.log('Inbox text nodes:', inboxEls.length ? inboxEls.join('\n') : 'NONE');
  
  await page.screenshot({ path: 'reports/inbox-check.png' });
  await browser.close();
}

main().catch(console.error);
