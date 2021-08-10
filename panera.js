let randomstring = require("randomstring");
let random_name = require('node-random-name');

function n(n){
  return n > 9 ? "" + n: "0" + n;
}

let signUpPanera = async function(page, catchall, fileNameParam) {
  await page.goto('https://www.panerabread.com/en-us/mypanera/sign-up-with-mypanera.html');

  await page.click('#top > section:nth-child(2) > div > section > div.iw-sign-up-landing-action-container > button.pds-button.pds-button-raised.pds-button-raised-primary');

  await page.waitFor(2000);

  let firstName = random_name({ first: true });
  let lastName = random_name({ last: true });
  await page.type('#firstName', firstName);
  await page.type('#lastName', lastName);
  await page.type('#phone', randomstring.generate({ length: 11, charset: 'numeric' }));
  let email = randomstring.generate(5) + catchall;
  let pwd = randomstring.generate(8);
  await page.type('#email', email);
  await page.type('#password', pwd);

  let today = new Date();
  let month = today.getMonth() + 1;
  let day = today.getDate();

  await page.type('#birthday', n(month));
  await page.waitFor(500);
  await page.type('#birthday', n(day));
  await page.waitFor(1000);
  await page.click('#top > section:nth-child(2) > div > section.animated.pds-background-white.iw-sign-up-form.fadeIn > div > form > fieldset > button');
  await page.waitFor(5000);

  //
  let isSuccess = await page.evaluate(() => {
    return document.querySelector('#top > section:nth-child(7) > div > div > a') != undefined;
  });
  console.log(isSuccess);

  const fs = require('fs')
  let content = 'fail';
  if (isSuccess) {
    content = 'success';
    content += '\r\nUserName : ' + firstName + ' ' + lastName;
    content += '\r\nEmail : ' + email;
    content += '\r\nPassword : ' + pwd;
    content += '\r\nBirthay : ' + n(month) + '/' + n(day);
  }

  fs.writeFile(process.env.OUTPUT_FILE_PATH + fileNameParam + '.txt', content, err => {
    if (err) {
      console.error(err)
    }
  })

  return isSuccess;
}

module.exports = signUpPanera;