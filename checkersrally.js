let randomstring = require("randomstring");
let random_name = require('node-random-name');

function n(n){
  return n > 9 ? "" + n: "0" + n;
}

let signUpCheckersRally = async function(page, catchall, fileNameParam) {
  await page.goto('https://checkersrallys.myguestaccount.com/guest/enroll?card-template=gz6U71JdL9Y%3d&template=0');

  const titleOption = ['Dr.', 'Mrs.', 'Mr.', 'Ms.', 'Rev.'];
  await page.select('#salutation', titleOption[Math.floor(Math.random() * 5)]);
  let firstName = random_name({ first: true });
  let lastName = random_name({ last: true });
  await page.type('#firstName', firstName);
  await page.type('#lastName', lastName);
  await page.type('#postalCode', randomstring.generate({ length: 5, charset: 'numeric' }));
  await page.type('#mobilePhone', randomstring.generate({ length: 11, charset: 'numeric' }));

  let today = new Date();
  let month = today.getMonth() + 1;
  let day = today.getDate();

  await page.type('#dateOfBirthMonth', month.toString());
  await page.type('#dateOfBirthDay', day.toString());  

  let email = randomstring.generate(5) + catchall;
  await page.type('#email', email);
  await page.type('#username', firstName + ' ' + lastName);

  let pwd = randomstring.generate(8);
  await page.type('#password', pwd);
  await page.type('#confirmPassword', pwd);  
  await page.click('#acceptTerms');

  await page.waitFor(1000);
  await page.click('#content-wrapper > div:nth-child(1) > div.container > div.row.reverseEnrollRegistrationFields > div > div > div.panel-body > form > div > div:nth-child(15) > div > button');

  await page.waitFor(5000);

  //
  let isSuccess = await page.evaluate(() => {
    return document.querySelector('#content-wrapper > div:nth-child(1) > div.container > div > div > div > div.panel-body > div > p.continue-to-account-balance') != undefined;
  });
  console.log(isSuccess);

  const fs = require('fs')
  let content = 'fail';
  if (isSuccess) {
    content = 'success';
    content += '\r\nUserName : ' + firstName + ' ' + lastName;
    content += '\r\nEmail : ' + email;
    content += '\r\nPassword : ' + pwd;
    content += '\r\nBirthay : ' + n(month + 1) + '/' + n(day);
  }

  fs.writeFile(process.env.OUTPUT_FILE_PATH + fileNameParam + '.txt', content, err => {
    if (err) {
      console.error(err)
    }
  })

  return isSuccess;
}

module.exports = signUpCheckersRally;