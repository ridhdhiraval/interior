const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  // We will load the page and look for the console logs
  page.on('console', msg => {
    if (msg.text().includes('FBX_SIZE_DEBUG')) {
      console.log(msg.text());
    }
  });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  
  // We will wait 5 seconds to ensure models load and log
  await new Promise(r => setTimeout(r, 5000));
  
  await browser.close();
})();
