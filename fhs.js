let randomstring = require("randomstring");
let random_name = require('node-random-name');

function n(n){
  return n > 9 ? "" + n: "0" + n;
}

let signUpFHS = async function(page, catchall, fileNameParam) {
  await page.goto('https://account.firehousesubs.com/auth/sign-up');
  
  let firstName = random_name({ first: true });
  let lastName = random_name({ last: true });
  await page.type("input[formcontrolname='firstName']", firstName);
  await page.type("input[formcontrolname='lastName']", lastName);
  let email = randomstring.generate(5) + catchall;
  await page.type("input[formcontrolname='email']", email);
  let pwd = randomstring.generate(8);
  await page.type("input[formcontrolname='password']", pwd);
  await page.type("input[formcontrolname='password_confirm']", pwd);
  await page.type("input[formcontrolname='phone_number']", randomstring.generate({ length: 11, charset: 'numeric' }));
  await page.type("input[formcontrolname='postal_code']", randomstring.generate({ length: 5, charset: 'numeric' }));

  let today = new Date();
  let month = today.getMonth();
  let day = today.getDay() + 1;
  let year = today.getFullYear() - Math.floor(Math.random() * 20) - 21;
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  await page.type("select[formcontrolname='month']", monthNames[month]);
  await page.type("select[formcontrolname='day']", n(day));
  await page.type("select[formcontrolname='year']", year.toString());

  await page.waitForSelector('body > app-root > app-client > div > app-auth > div > app-sign-up > div > div > div.sign-up--left > form > div:nth-child(13) > button');
  const signUpBtn = await page.$('body > app-root > app-client > div > app-auth > div > app-sign-up > div > div > div.sign-up--left > form > div:nth-child(13) > button');
  
  // 1-2) try to re-CAPTCHA
  while (true) {
    
    signUpBtn.click();
    await page.waitFor(1000);

    console.log("Try to re-captcha");
    const {
      captchas,
      filtered,
      solutions,
      solved,
      error
    } = await page.solveRecaptchas();
    console.log("re-Captcha finished");

    await page.waitFor(2000);

    if (solved[0].isSolved) break;
  }

  await page.waitFor(10000);
  let isSuccess = await page.evaluate(() => {
    return document.querySelector('body > app-root > app-client > div > app-auth > div > app-sign-up > div > div > div.sign-up--left > form > div:nth-child(13) > button') == undefined;
  });
  console.log(isSuccess);

  const fs = require('fs')
  let content = 'fail';
  if (isSuccess) {
    content = 'success';
    content += '\r\nUserName : ' + firstName + ' ' + lastName;
    content += '\r\nEmail : ' + email;
    content += '\r\nBirthay : ' + n(month + 1) + '/' + n(day) + '/' + year.toString();
  }

  fs.writeFile(process.env.OUTPUT_FILE_PATH + fileNameParam + '.txt', content, err => {
    if (err) {
      console.error(err)
    }
  })
}

module.exports = signUpFHS;
