const puppeteer = require('puppeteer-extra');
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');

const signUpCinnabon = require('./cinnabon.js');
const signUpDennys = require('./dennys.js');
const signUpFHS = require('./fhs.js');
const signUpKrispy = require('./krispy.js');

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
  // Makes the browser to be launched in a headful way
  const browser = await puppeteer.launch({ headless : false });
  const page = await browser.newPage();
  
  //signUpDennys(page, "@test.com");
  //signUpCinnabon(page, "@test.com");
  signUpFHS(page, "@test.com");
  //signUpKrispy(page, "@test.com");

  await page.waitFor(300000);
  await browser.close();
})();