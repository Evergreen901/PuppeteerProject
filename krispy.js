let randomstring = require("randomstring");
let random_name = require('node-random-name');

function n(n){
  return n > 9 ? "" + n: "0" + n;
}

let signUpKrispy = async function(page, catchall) {
  await page.goto('https://www.krispykreme.com/account/create-account');

  await page.type('#ctl00_plcMain_txtFirstName', random_name({ first: true }));
  await page.type('#ctl00_plcMain_txtLastName', random_name({ last: true }));

  let today = new Date();
  let month = today.getMonth() + 1;
  let day = today.getDay() + 1;

  await page.type('#ctl00_plcMain_ddlBirthdayMM', n(month));
  await page.type('#ctl00_plcMain_ddlBirthdayDD', n(day));
  await page.type('#ctl00_plcMain_txtZipCode', randomstring.generate({ length: 5, charset: 'numeric' }));
  await page.type('#ctl00_plcMain_ucPhoneNumber_txt1st', randomstring.generate({ length: 3, charset: 'numeric' }));
  await page.type('#ctl00_plcMain_ucPhoneNumber_txt2nd', randomstring.generate({ length: 3, charset: 'numeric' }));
  await page.type('#ctl00_plcMain_ucPhoneNumber_txt3rd', randomstring.generate({ length: 4, charset: 'numeric' }));
  
  let email = randomstring.generate(5) + catchall;
  await page.type('#ctl00_plcMain_txtEmail', email);
  await page.type('#ctl00_plcMain_txtPassword', randomstring.generate({ length: 8, charset: 'numeric' }));
  await page.click('#ctl00_plcMain_cbTermsOfUse');

  // 1-2) try to re-CAPTCHA
  while (true) {
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
  }

  await page.click('#btnSubmit');
  await page.waitFor(5000);

  //
  let isSuccess = await page.evaluate(() => {
    return document.querySelector('#btnSubmit') == undefined;
  });
  console.log(isSuccess);
}

module.exports = signUpKrispy;
