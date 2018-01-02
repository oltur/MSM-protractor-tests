"use strict";
var until = require('selenium-webdriver').until;

var LoginModel = require('../models/login-model.js');
var MainPage = require('../models/main-page-model.js');
var PageUrls = require('../models/page-urls-model.js');

var loginModel = new LoginModel();
var mainPage = new MainPage();
var pageUrls = new PageUrls();

var Out = require('../tools/out.js');
var Db = require('../tools/db.js');
var db = new Db();

var Helpers = require('../tools/helpers.js');

describe('MSM site smoke test', function () {

  var testData = require('../json/test-data.json');
  var currentSpec;

  var context = {};
  var out = new Out();
  var driver = browser.driver;
  var helpers = new Helpers(browser, out, context);

  // #region shorthands
  // shorthands
  var c = context;
  var o = out;
  var b = browser;
  var d = driver;
  var h = helpers;
  // #endregion

  beforeEach(() => {
    out.group();
    d.ignoreSynchronization = true;
    h.logoutIfNeeded()
  });

  afterEach(() => {
    out.groupEnd();
  });

  // currentSpec = it('should get the Db versions', h.getHandler(currentSpec, (done) => {
  //   out.log(`Test name: '${currentSpec.description}'`);
  //   db.getData().then(data => {
  //     out.log("The FreedomSite version is: " + data);
  //     done()
  //   });
  // }));

  currentSpec = it('should login, open a Product page and use Go to store button', h.getHandler(currentSpec, async (done) => {
    try {
      out.log(`Test name: 'should login, open a Product page and use Go to store button'`);
      await h.login();

      out.log(`Opening the basket`);
      await d.get(h.getAbsoluteUrl(pageUrls.reviewCart))

      out.log(`Cleaning the basket if not empty'`);
      try {
        await h.findAndClick(by.id("RemoveOrder"))
      } catch (error) {}
      await h.testProductPagesAndGoToStore(testData.goToStore.productIds, 0);
      
    } catch (error) {
      await new Error("Test failed. Reason: " + error + ' ' + error.stack)
    }
  }));

});