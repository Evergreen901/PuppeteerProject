let randomstring = require("randomstring");
let random_name = require('node-random-name');
const { NoCaptchaTaskProxyless } = require("node-capmonster")

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
  const recaptcha = new NoCaptchaTaskProxyless("d72cfbca58f2aa138bfc1a3821f31823")
  recaptcha.createTask("6Lc4iwIaAAAAAHpijD7fQ_rJIdWZtvpodAsPt8AA", "https://www.krispykreme.com/account/create-account")
  .then((taskId) => {
      console.info(taskId);
      return taskId
  }).then((taskId) => {
      return taskId;
  }).then((taskId) => {
      recaptcha.joinTaskResult(taskId)
          .then((response) => {console.info(response)})
  })

  await page.click('#btnSubmit');
  await page.waitFor(5000);

  //
  let isSuccess = await page.evaluate(() => {
    return document.querySelector('#ctl00_lnkOrderNowDesktop') != undefined;
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

module.exports = signUpKrispy;
