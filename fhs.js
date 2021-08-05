let randomstring = require("randomstring");
let random_name = require('node-random-name');

function n(n){
  return n > 9 ? "" + n: "0" + n;
}

let signUpFHS = async function(page, catchall) {
  await page.goto('https://account.firehousesubs.com/auth/sign-up');
  
  await page.type("input[formcontrolname='firstName']", random_name({ first: true }));
  await page.type("input[formcontrolname='lastName']", random_name({ last: true }));
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

  await page.click('body > app-root > app-client > div > app-auth > div > app-sign-up > div > div > div.sign-up--left > form > div:nth-child(13) > button');
  await page.waitFor(1000);

  // 1-2) try to re-CAPTCHA
  while (true) {
    let needToReCaptcha = await page.evaluate(() => {
        return $("#rc-imageselect") != undefined;
    });
    if (!needToReCaptcha) {
        break;
    }
    console.log("Try to re-captcha");
    await page.solveRecaptchas();
    console.log("re-Captcha finished");

    // wait for 5 seconds
    await new Promise((res, rej)=> {
        let timerID = setInterval(()=>{
            res();
            clearInterval(timerID);
        }, 5000)
    });
  }
}

module.exports = signUpFHS;
