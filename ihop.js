let randomstring = require("randomstring");
let random_name = require('node-random-name');

function n(n){
  return n > 9 ? "" + n: "0" + n;
}

let signUpIHop = async function(page, catchall) {
  await page.goto('https://www.ihop.com/en');
  await page.click('#section_main > div.myhop-bar > div > a');

  let email = randomstring.generate(5) + catchall;
  await page.type('#email', email);
  await page.type('#password', randomstring.generate(13));
  await page.type('#firstName', random_name({ first: true }));
  await page.type('#lastName', random_name({ last: true }));

  await page.type('#mobileNumber', randomstring.generate({ length: 11, charset: 'numeric' }));

  let today = new Date();
  let month = today.getMonth();
  let day = today.getDay() + 1;
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
}

module.exports = signUpIHop;