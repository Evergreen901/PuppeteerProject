let randomstring = require("randomstring");
let random_name = require('node-random-name');

function n(n){
  return n > 9 ? "" + n: "0" + n;
}

let signUpCinnabon = async function(page, catchall) {
  await page.goto('https://www.cinnabon.com/join-club-cinnabon');
  
  await page.waitForSelector("iframe");
  const elementHandle = await page.$('body > main > section.clearfix.section-padding-top-20-20.section-padding-bottom-20-20 > div > div > center > iframe');
  const frame = await elementHandle.contentFrame();
  
  await frame.waitForSelector('#s_email');
  const s_email = await frame.$('#s_email');
  let email = randomstring.generate(5) + catchall;
  await s_email.type(email);

  await frame.waitForSelector('#s_firstname');
  const s_firstname = await frame.$('#s_firstname');
  s_firstname.type(random_name({ first: true }));

  await frame.waitForSelector('#s_lastname');
  const s_lastname = await frame.$('#s_lastname');
  s_lastname.type(random_name({ first: true }));
  
  let today = new Date();
  let month = today.getMonth();
  let day = today.getDay() + 1;
  let year = today.getFullYear() - Math.floor(Math.random() * 20) - 21;
  
  await frame.waitForSelector('#s_birthday');
  const s_birthday = await frame.$('#s_birthday');
  s_birthday.type(n(month) + n(day) + year.toString());

  await frame.waitForSelector('#s_zipcode');
  const s_zipcode = await frame.$('#s_zipcode');
  await frame.waitForSelector('#zipbutton');
  const zipbutton = await frame.$('#zipbutton');
  await frame.waitForSelector('#s_agree');
  const s_agree = await frame.$('#s_agree');
  //s_agree.click();
  await frame.evaluate( () => document.getElementById("s_agree").checked = true );

  do {
    await s_zipcode.focus();

    await page.keyboard.down('Control');
    await page.keyboard.press('A');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await s_zipcode.type(randomstring.generate({ length: 5, charset: 'numeric' }));
    await zipbutton.click();
    await page.waitFor(2000);

    const count =  await frame.$$eval('input[name=s_storenumber]', ele => ele.length);
    console.log('location count : ' + count);
    if (count > 0) {
      await frame.click('input[name=s_storenumber]');
      break;
    }    
  } while(1);

  await page.waitFor(1000);
  await frame.waitForSelector('.prim-btn');
  const prim_btn = await frame.$('.prim-btn');
  prim_btn.click();
}

module.exports = signUpCinnabon;
