const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const { URL } = require('url');
const run = async url => {
  // Use Puppeteer to launch headful Chrome and don't use its default 800x600 viewport.
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null
  });
  browser.on('targetchanged', async target => {
    const page = await target.page();
    function addStyleContent(content) {
      const style = document.createElement('style');
      style.type = 'text/css';
      style.appendChild(document.createTextNode(content));
      document.head.appendChild(style);
    }
    const css = '* {color: red}';
    if (page && page.url() === url) {
      const client = await page.target().createCDPSession();
      await client.send('Runtime.evaluate', {
        expression: `(${addStyleContent.toString()})('${css}')`
      });
    }
  });
  const { lhr } = await lighthouse(
    url,
    {
      port: new URL(browser.wsEndpoint()).port,
      output: 'json',
      logLevel: 'error',
      chromeFlags: ['--show-paint-rects'],
      onlyCategories: ['performance', 'pwa']
    },
    {
      extends: 'lighthouse:default'
    }
  );
  await browser.close();
  return {
    pwa: lhr.categories.pwa.score,
    performance: lhr.categories.performance.score
  };
};

run('https://awesome-apress-pwa.firebaseapp.com').then(res => console.log(res));
