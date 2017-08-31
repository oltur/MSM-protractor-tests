"use strict";
var testData = require('../json/test-data.json');
var out = require('../tools/out.js').getInstance();
var until = require('selenium-webdriver').until;
var db = require('../tools/db.js').getInstance();
var loginModel = require('../models/login-model.js').getInstance();
var mainPageModel = require('../models/main-page-model.js').getInstance();

describe('MSM site smoke test', function () {

  var d = browser.driver;
  var h = require('../tools/helpers.js').getInstance(browser, out);

  var currentSpec;

  beforeEach(() => {
    out.group();
    d.ignoreSynchronization = true;
    d.get(h.getStartPage());
  });

  afterEach(() => {
    out.groupEnd();
  });

  currentSpec = it('should get a FreedomSite Db version', h.getHandler(currentSpec, (done) => {
    out.log(`Test name: '${currentSpec.description}'`);
    db.getData().then(data => {
      out.log("The data is: " + data);
      done()
    });
  }));

  currentSpec = it('should have a title', h.getHandler(currentSpec, (done) => {
    out.log(`Test name: '${currentSpec.description}'`);
    out.log("Verifying title");
    expect(d.getTitle()).toContain('mySupermarket');
    done()
  }));

  currentSpec = it('should open a main page', h.getHandler(currentSpec, (done) => {
    out.log(`Test name: '${currentSpec.description}'`);
    h.login()
      .then(() => {
        out.log("Verifying ListTitle");
        return h.findAndExpectTextContain(mainPageModel.$ListTitle, ' Top Offers')
      })
      .then(() => done());
  }));

});