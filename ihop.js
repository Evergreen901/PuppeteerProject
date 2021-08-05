let randomstring = require("randomstring");
let random_name = require('node-random-name');

function n(n){
  return n > 9 ? "" + n: "0" + n;
}

let signUpIHop = async function(page, catchall) {
  await page.goto('https://www.ihop.com/en');

  await page.click('#section_main > div.myhop-bar > div > a');

  
}

module.exports = signUpIHop;