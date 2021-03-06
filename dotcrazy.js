let randomstring = require("randomstring");
let random_name = require('node-random-name');

function n(n){
  return n > 9 ? "" + n: "0" + n;
}

let signUpDotCrazy = async function(page, catchall, fileNameParam) {
  await page.goto('https://www.dippindots.com/dotcrazy/signup.html');

  let email = randomstring.generate(5) + catchall;
  await page.type('#emailAddr', email);

  let today = new Date();
  let month = today.getMonth() + 1;
  let day = today.getDate();
  let year = today.getFullYear() - Math.floor(Math.random() * 20) - 21;

  await page.type('#birthdayMonthSelect', month.toString());
  await page.type('#birthdayDaySelect', day.toString());
  await page.type('#birthYearSelect', year.toString());
  
  await page.type('#postcode', randomstring.generate({ length: 5, charset: 'numeric' }));
  await page.click('#send-submit-button');

  await page.waitFor(5000);

  //
  let isSuccess = await page.evaluate(() => {
    return document.querySelector('#maincontent > div > div > div > div > div > div > h1') != undefined;
  });
  console.log(isSuccess);

  const fs = require('fs')
  let content = 'fail';
  if (isSuccess) {
    content = 'success';
    content += '\r\nEmail : ' + email;
    content += '\r\nBirthay : ' + n(month) + '/' + n(day) + '/' + year.toString();
  }

  fs.writeFile(process.env.OUTPUT_FILE_PATH + fileNameParam + '.txt', content, err => {
    if (err) {
      console.error(err)
    }
  })

  return isSuccess;
}

module.exports = signUpDotCrazy;