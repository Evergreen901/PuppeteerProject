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

process.argv.forEach((val, index) => {
  if (index == 2) {
    siteParam = val;
  }
  else if (index == 3) {
    catchallParam = val;
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
  // MongoClient.connect(url, function (err, db) {
  //   console.log(db);
  //   db.collection('accounts', function (err, collection) {
  //     do 
  //     {
  //       email = randomstring.generate(5) + catchallParam;
  //       var query = { email: email };
        
  //       collection.find(query).toArray(function(err, result) {
  //         if (err) throw err;
  //         console.log(result);
  //       });
        
  //       break;
  //     } while(1);
      
  //     collection.insertOne({ email: email }, function(err, res) {
  //       if (err) throw err;
  //       console.log(email + " inserted");
  //     });
  //   });
  //   db.close();  
  // });


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

  if (siteParam == 'dennys') {
    isSuccess = await signUpDennys(page, email);
  }
  else if (siteParam == 'cinnabon') {
    signUpCinnabon(page, catchallParam);
  }
  else if (siteParam == 'fhs') {
    signUpFHS(page, catchallParam);
  }
  else if (siteParam == 'krispy') {
    signUpKrispy(page, catchallParam);
  }
  else if (siteParam == 'dotcrazy') {
    signUpDotCrazy(page, catchallParam);
  }
  else if (siteParam == 'checkers') {
    signUpCheckersRally(page, catchallParam);
  }
  else if (siteParam == 'panera') {
    signUpPanera(page, catchallParam);
  }
  else if (siteParam == 'ihop') {
    signUpIHop(page, '@test.com');
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
  
  await browser.close();
})();