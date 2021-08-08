let randomstring = require("randomstring");
let random_name = require('node-random-name');

function n(n){
  return n > 9 ? "" + n: "0" + n;
}

let signUpDennys = async function(page, email) {
  await page.goto('https://www.dennys.com/rewards/');

  const titleOption = ['Ms.', 'Mrs.', 'Mr.', 'Dr.', 'Rev.'];
  

  let today = new Date();
  let month = today.getMonth() + 1;
  let day = today.getDay() + 1;
  let year = today.getFullYear() - Math.floor(Math.random() * 20) - 21;
  let zipcode = randomstring.generate({ length: 5, charset: 'numeric' });
  let phone = randomstring.generate({ length: 11, charset: 'numeric' });
  let title = titleOption[Math.floor(Math.random() * 5)];
  let firstName = random_name({ first: true });
  let lastName = random_name({ last: true });

  await page.select('#title', title);
  await page.type('#first_name', firstName);
  await page.type('#last_name', lastName);
  await page.type('#Birthdate-month', n(month));
  await page.type('#Birthdate-day', n(day));
  await page.type('#Birthdate-year', year.toString());
  await page.type('#zip_code', zipcode);
  await page.type('#phone', phone);
  await page.type('#email', email);
  await page.type('#email_confirm', email);
  
  do {
    await page.evaluate( () => document.getElementById("SearchText").value = "");
    await page.type('#SearchText', randomstring.generate({ length: 3, charset: 'numeric' }));
    await page.click('#location_search_go');
    await page.waitFor(2000);

    const count =  await page.$$eval('.contact-btn-location', ele => ele.length);
    console.log('location count : ' + count);
    if (count > 0) {
      await page.click('.contact-btn-location');
      break;
    }    
  } while(1);

  await page.waitFor(2000);
  await page.click('#rewards_form > footer > button.fancy-light-btn.js-form-submit');

  await page.waitFor(5000);

  //
  let isSuccess = await page.evaluate(() => {
    return document.querySelector('#rewards_form > footer > button.fancy-light-btn.js-form-submit') == undefined;
  });
  console.log(isSuccess);

  const fs = require('fs')
  let content = 'fail';
  if (isSuccess) {
    content = 'success';
    content += '\r\nUserName : ' + firstName + ' ' + lastName;
    content += '\r\nEmail : ' + email;    
  }

  fs.writeFile(process.env.OUTPUT_FILE_PATH, content, err => {
    if (err) {
      console.error(err)
    }
  })

  return isSuccess;
}

module.exports = signUpDennys;