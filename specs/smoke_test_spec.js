"use strict";
var until = require('selenium-webdriver').until;

var Out = require('../tools/out.js');
var Db = require('../tools/db.js');
var db = new Db();

var LoginModel = require('../models/login-model.js');
var MainPage = require('../models/main-page-model.js');
var PageUrls = require('../models/page-urls-model.js');

var loginModel = new LoginModel();
var mainPage = new MainPage();
var pageUrls = new PageUrls();

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

  // currentSpec = it('should have a title', h.getHandler(currentSpec, (done) => {
  //   out.log(`Test name: 'should have a title'`);
  //   out.log("Verifying title");
  //   expect(d.getTitle()).toContain('mySupermarket');
  //   done()
  // }));

  currentSpec = it('should login and open a main page', h.getHandler(currentSpec, (done) => {
    out.log(`Test name: 'should login, open a main page, and click through a menu'`);
    h.login()
      .then(() => {
        out.log("Verifying ListTitle");
        return h.findAndExpectTextContain(mainPageModel.$listTitle, 'Savvy Buys')
      })
      .then(() => {
        out.log("Clicking every menu item");

        return h.clickEveryMenuItem();
      })
      .then(() => done()
      ,error => {
        throw new Error("Test failed. Reason: " + error + ' ' + error.stack)
      }
    );
  }));

});