let randomstring = require("randomstring");
let random_name = require('node-random-name');

function n(n){
  return n > 9 ? "" + n: "0" + n;
}

let signUpDotCrazy = async function(page, catchall) {
  await page.goto('https://www.dippindots.com/dotcrazy/signup.html');

  let email = randomstring.generate(5) + catchall;
  await page.type('#emailAddr', email);

  let today = new Date();
  let month = today.getMonth() + 1;
  let day = today.getDay() + 1;
  let year = today.getFullYear() - Math.floor(Math.random() * 20) - 21;

  await page.type('#birthdayMonthSelect', month.toString());
  await page.type('#birthdayDaySelect', day.toString());
  await page.type('#birthdayYearSelect', year.toString());
  
  await page.type('#postcode', randomstring.generate({ length: 5, charset: 'numeric' }));
  await page.click('#send-submit-button');
}

module.exports = signUpDotCrazy;