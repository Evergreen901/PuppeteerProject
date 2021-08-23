const puppeteer = require('puppeteer-extra');
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');

const signUpCinnabon = require('./cinnabon.js');
const signUpDennys = require('./dennys.js');
const signUpFHS = require('./fhs.js');
const signUpKrispy = require('./krispy.js');
const signUpDotCrazy = require('./dotcrazy.js');
const signUpCheckersRally = require('./checkersrally.js');
const signUpPanera = require('./panera.js');
const signUpIHop = require('./ihop.js')

let randomstring = require("randomstring");
var url = 'mongodb://localhost:27017/AccountBotDB';
var MongoClient = require('mongodb').MongoClient;

let siteParam;
let catchallParam;
let fileNameParam;

process.argv.forEach((val, index) => {
  if (index == 2) {
    siteParam = val;
  } else if (index == 3) {
    catchallParam = val;
  } else if (index == 4) {
    fileNameParam = val;
  }
})

// Re-CAPTCHA configuration
puppeteer.use(
  RecaptchaPlugin({
      provider: {
          id: '2captcha',
          token: '3d8dc897fdbd1a78f518c7a40f05e83e' // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY ⚡
      },
      visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
  })
);

(async () => {
  if (siteParam == undefined || catchallParam == undefined) {
    console.log('Parameter error.');
    //return;
  }

  var email = "";
  const client = new MongoClient("mongodb://localhost:27017");
  async function run() { 

    const dotenv = require('dotenv');
    dotenv.config();
    
    try {
      await client.connect();
      const database = client.db("accountdb");
      const collection = database.collection("accounts");

      do {
        email = randomstring.generate(5) + catchallParam;
        const cursor = collection.find({email: email});
        
        let flag = 0;
        await cursor.forEach(function(item){
          flag = 1;
        });

        if (flag == 0) break;
      } while(1);
    } catch (error){
      console.warn("ERROR: " + error);
      if (errCallback) errCallback(error);
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);
  
  // Makes the browser to be launched in a headful way
  const browser = await puppeteer.launch({ headless : false });
  const page = await browser.newPage();
  let isSuccess = false;

  try
  {
    if (siteParam == 'dennys') {
      isSuccess = await signUpDennys(page, email, fileNameParam);
    }
    else if (siteParam == 'cinnabon') {
      isSuccess = await signUpCinnabon(page, catchallParam, fileNameParam);
    }
    else if (siteParam == 'fhs') {
      isSuccess = await signUpFHS(page, catchallParam, fileNameParam);
    }
    else if (siteParam == 'krispy') {
      isSuccess = await signUpKrispy(page, catchallParam, fileNameParam);
    }
    else if (siteParam == 'dotcrazy') {
      isSuccess = await signUpDotCrazy(page, catchallParam, fileNameParam);
    }
    else if (siteParam == 'checkers') {
      isSuccess = await signUpCheckersRally(page, catchallParam, fileNameParam);
    }
    else if (siteParam == 'panera') {
      isSuccess = await signUpPanera(page, catchallParam, fileNameParam);
    }
    else if (siteParam == 'ihop') {
      isSuccess = await signUpIHop(page, catchallParam, fileNameParam);
    }
  } catch (e) {
    const fs = require('fs')
    let content = 'fail';
    
    fs.writeFile(process.env.OUTPUT_FILE_PATH + fileNameParam + '.txt', content, err => {
      if (err) {
        console.error(err)
      }
    })
  }
  
  console.log(isSuccess);

  if (isSuccess) {
    const client = new MongoClient("mongodb://localhost:27017");
    async function run() { 

      try {
        await client.connect();
        const database = client.db("accountdb");
        const collection = database.collection("accounts");
        await collection.insertOne({ email : email });
      } catch (error){
        console.warn("ERROR: " + error);
        if (errCallback) errCallback(error);
      } finally {
        await client.close();
      }
    }
    run().catch(console.dir);
  }

  //await page.waitFor(5000000);
  await browser.close();
})();