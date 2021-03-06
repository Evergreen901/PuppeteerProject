let randomstring = require("randomstring");
let random_name = require('node-random-name');

function n(n){
  return n > 9 ? "" + n: "0" + n;
}

let signUpIHop = async function(page, catchall, fileNameParam) {
  await page.goto('https://www.ihop.com/en');
  await page.click('#section_main > div.myhop-bar > div > a');

  let email = randomstring.generate(5) + catchall;
  let pwd = randomstring.generate(13);
  let firstName = random_name({ first: true });
  let lastName = random_name({ last: true });
  await page.type('#email', email);
  await page.type('#password', pwd);
  await page.type('#firstName', firstName);
  await page.type('#lastName', lastName);

  await page.type('#mobileNumber', randomstring.generate({ length: 11, charset: 'numeric' }));

  let today = new Date();
  let month = today.getMonth();
  let day = today.getDate();
  let year = today.getFullYear() - Math.floor(Math.random() * 20) - 21;
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  await page.type("#birthMonth", monthNames[month]);
  await page.type("#birthDay", day.toString());
  await page.type("#birthYear", year.toString());

  do {
    await page.evaluate( () => document.getElementById("zipCode").value = "");
    await page.type('#zipCode', randomstring.generate({ length: 5, charset: 'numeric' }));
    await page.waitFor(2000);

    const count =  await page.$$eval('#preferredIHOP option', ele => ele.length);
    console.log('location count : ' + count);
    if (count > 0) {
      await page.type('#preferredIHOP', 'abcdefghijklmnopqrstuvwxyz')
      break;
    }    
  } while(1);

  await page.click('#section_main > div.myhop-modal.myhop-modal--signup > div > div > div.myhop-signup.language-signup-en > fieldset.myhop-signup__group.myhop-signup__group--terms > div:nth-child(3) > label');
  await page.click('#signupButton');  

  let isSuccess = await page.evaluate(() => {
    return document.querySelector('#section_main > div.myhop-modal.myhop-modal--signup > div > div > div.myhop-success > h2') != undefined;
  });
  console.log(isSuccess);

  const fs = require('fs')
  let content = 'fail';
  if (isSuccess) {
    content = 'success';
    content += '\r\nUserName : ' + firstName + ' ' + lastName;
    content += '\r\nEmail : ' + email;
    content += '\r\nPassword : ' + pwd;
    content += '\r\nBirthay : ' + n(month + 1) + '/' + n(day) + '/' + year.toString();
  }

  fs.writeFile(process.env.OUTPUT_FILE_PATH + fileNameParam + '.txt', content, err => {
    if (err) {
      console.error(err)
    }
  })

  return isSuccess;
}

module.exports = signUpIHop;