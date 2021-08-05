let randomstring = require("randomstring");
let random_name = require('node-random-name');

function n(n){
  return n > 9 ? "" + n: "0" + n;
}

let signUpPanera = async function(page, catchall) {
  await page.goto('https://www.panerabread.com/en-us/mypanera/sign-up-with-mypanera.html');

  await page.click('#top > section:nth-child(2) > div > section > div.iw-sign-up-landing-action-container > button.pds-button.pds-button-raised.pds-button-raised-primary');

  await page.waitFor(2000);

  await page.type('#firstName', random_name({ first: true }));
  await page.type('#lastName', random_name({ last: true }));
  await page.type('#phone', randomstring.generate({ length: 11, charset: 'numeric' }));
  let email = randomstring.generate(5) + catchall;
  await page.type('#email', email);
  await page.type('#password', randomstring.generate(8));

  let today = new Date();
  let month = today.getMonth() + 1;
  let day = today.getDay() + 1;
  let year = today.getFullYear() - Math.floor(Math.random() * 20) - 21;

  await page.type('#birthday', n(month) + n(day));
  await page.click('#top > section:nth-child(2) > div > section.animated.pds-background-white.iw-sign-up-form.fadeIn > div > form > fieldset > button');
  await page.waitFor(5000);

  //
  let isSuccess = await page.evaluate(() => {
    return document.querySelector('#top > section:nth-child(2) > div > section.animated.pds-background-white.iw-sign-up-form.fadeIn > div > form > fieldset > button') == undefined;
  });
  console.log(isSuccess);
}

module.exports = signUpPanera;