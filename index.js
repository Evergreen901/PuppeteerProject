const puppeteer = require('puppeteer-extra');
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');
const titleOption = ['Ms.', 'Mrs.', 'Mr.', 'Dr.', 'Rev.'];
let randomstring = require("randomstring");
let random_name = require('node-random-name');

function n(n){
  return n > 9 ? "" + n: "0" + n;
}

// Re-CAPTCHA configuration
puppeteer.use(
  RecaptchaPlugin({
      provider: {
          id: '2captcha',
          token: 'b887260662148149167839206e79bf45' // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY ⚡
      },
      visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
  })
);

(async () => {
  // Makes the browser to be launched in a headful way
  const browser = await puppeteer.launch({ headless : false });
  const page = await browser.newPage();
  await page.goto('https://www.dennys.com/rewards/');

  await page.select('#title', titleOption[Math.floor(Math.random() * 5)]);
  await page.type('#first_name', random_name({ first: true }));
  await page.type('#last_name', random_name({ last: true }));

  let today = new Date();
  let month = today.getMonth() + 1;
  let day = today.getDay() + 1;
  let year = today.getFullYear() - Math.floor(Math.random() * 20) - 21;

  await page.type('#Birthdate-month', n(month));
  await page.type('#Birthdate-day', n(day));
  await page.type('#Birthdate-year', year.toString());
  
  await page.type('#zip_code', randomstring.generate({ length: 5, charset: 'numeric' }));
  await page.type('#phone', randomstring.generate({ length: 11, charset: 'numeric' }));

  let email = randomstring.generate(5) + "@test.com";
  await page.type('#email', email);
  await page.type('#email_confirm', email);
  
  do {
    await page.evaluate( () => document.getElementById("SearchText").value = "");
    await page.type('#SearchText', randomstring.generate({ length: 3, charset: 'numeric' }));
    await page.focus('#SearchText');
    await page.click('#location_search_go');
    await page.waitFor(2000);

    const count =  await page.$$eval('.contact-btn-location', ele => ele.length);
    console.log('location count : ' + count);
    if (count > 0) {
      await page.click('.contact-btn-location');
      break;
    }    
  } while(1);

  await page.waitFor(2000);
  await page.click('#rewards_form > footer > button.fancy-light-btn.js-form-submit');
  await page.waitFor(100000);
  await browser.close();
})();