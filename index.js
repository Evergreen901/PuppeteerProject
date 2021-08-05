const puppeteer = require('puppeteer-extra');
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');

const signUpCinnabon = require('./cinnabon.js');
const signUpDennys = require('./dennys.js');
const signUpFHS = require('./fhs.js');
const signUpKrispy = require('./krispy.js');
const signUpDotCrazy = require('./dotcrazy.js');
const signUpCheckersRally = require('./checkersrally.js');
const signUpPanera = require('./panera.js');
const signUpIHop = require('./ihop.js')

let siteParam;
let catchallParam;

process.argv.forEach((val, index) => {
  if (index == 2) {
    siteParam = val;
  }
  else if (index == 3) {
    catchallParam = val;
  }
})

// Re-CAPTCHA configuration
puppeteer.use(
  RecaptchaPlugin({
      provider: {
          id: '2captcha',
          token: '3d8dc897fdbd1a78f518c7a40f05e83e' // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY ⚡
      },
      visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
  })
);

(async () => {
  if (siteParam == undefined || catchallParam == undefined) {
    console.log('Parameter error.');
    return;
  }
  // Makes the browser to be launched in a headful way
  const browser = await puppeteer.launch({ headless : false });
  const page = await browser.newPage();
  
  if (siteParam == 'dennys') {
    signUpDennys(page, catchallParam);
  }
  else if (siteParam == 'cinnabon') {
    signUpCinnabon(page, catchallParam);
  }
  else if (siteParam == 'fhs') {
    signUpFHS(page, catchallParam);
  }
  else if (siteParam == 'krispy') {
    signUpKrispy(page, catchallParam);
  }
  else if (siteParam == 'dotcrazy') {
    signUpDotCrazy(page, catchallParam);
  }
  else if (siteParam == 'checkers') {
    signUpCheckersRally(page, catchallParam);
  }
  else if (siteParam == 'panera') {
    signUpPanera(page, catchallParam);
  }
  else if (siteParam == 'ihop') {
    signUpIHop(page, '@test.com');
  }
  
  await page.waitFor(300000);
  await browser.close();
})();