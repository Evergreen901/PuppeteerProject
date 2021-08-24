let randomstring = require("randomstring");
let random_name = require('node-random-name');

function n(n){
  return n > 9 ? "" + n: "0" + n;
}

let signUpKrispy = async function(page, catchall, fileNameParam) {
  await page.goto('https://www.krispykreme.com/account/create-account');

  let firstName = random_name({ first: true });
  let lastName = random_name({ last: true });
  await page.type('#ctl00_plcMain_txtFirstName', firstName);
  await page.type('#ctl00_plcMain_txtLastName', lastName);

  let today = new Date();
  let month = today.getMonth() + 1;
  let day = today.getDate();

  await page.type('#ctl00_plcMain_ddlBirthdayMM', n(month));
  await page.type('#ctl00_plcMain_ddlBirthdayDD', n(day));
  await page.type('#ctl00_plcMain_txtZipCode', randomstring.generate({ length: 5, charset: 'numeric' }));
  await page.type('#ctl00_plcMain_ucPhoneNumber_txt1st', randomstring.generate({ length: 3, charset: 'numeric' }));
  await page.type('#ctl00_plcMain_ucPhoneNumber_txt2nd', randomstring.generate({ length: 3, charset: 'numeric' }));
  await page.type('#ctl00_plcMain_ucPhoneNumber_txt3rd', randomstring.generate({ length: 4, charset: 'numeric' }));
  
  let email = randomstring.generate(5) + catchall;
  await page.type('#ctl00_plcMain_txtEmail', email);
  let pwd = randomstring.generate({ length: 8, charset: 'numeric' });
  await page.type('#ctl00_plcMain_txtPassword', pwd);
  await page.click('#ctl00_plcMain_cbTermsOfUse');

  // 1-2) try to re-CAPTCHA
  /*while (true) {
    console.log("Try to re-captcha");
    const {
      captchas,
      filtered,
      solutions,
      solved,
      error
    } = await page.solveRecaptchas();
    console.log("re-Captcha finished");
    await page.waitFor(3000);

    if (solved[0].isSolved) break;
  }*/
  
  const ac = require("@antiadmin/anticaptchaofficial");
  await ac.setAPIKey('0f70f8e2bcfb123f849b7fc84d770327');
  await ac.getBalance()
   .then(balance => console.log('my balance is $'+balance))
   .catch(error => console.log('received error '+error));

  let token = await ac.solveRecaptchaV2Proxyless('https://www.krispykreme.com/account/create-account', '6Lc4iwIaAAAAAHpijD7fQ_rJIdWZtvpodAsPt8AA');
  if (!token) {
     console.log('something went wrong');
     return;
  }

  await tab.$eval('#g-recaptcha-response', (element, token) => {
      element.value = token;
  }, token);

  await page.evaluate(() => {
    onReCaptchaUpdate (token);
  });

  await page.waitFor(2000);
  await page.click('#btnSubmit');
  await page.waitFor(4000);

  //
  let isSuccess = await page.evaluate(() => {
    return document.querySelector('#ctl00_lnkOrderNowDesktop') != undefined;
  });
  console.log(isSuccess);

  await page.waitFor(400000);

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

module.exports = signUpKrispy;
