"use strict";
var out = require('../tools/out.js').getInstance();
var until = require('selenium-webdriver').until;

var db = require('../tools/db.js').getInstance();

var loginModel = require('../models/login-model.js').getInstance();
var mainPageModel = require('../models/main-page-model.js').getInstance();
var pageUrls = require('../models/page-urls-model.js').getInstance();

describe('MSM site smoke test', function () {

  var testData = require('../json/test-data.json');
  var currentSpec;

  var context = {};
  var out = require('../tools/out.js').getInstance();
  var driver = browser.driver;
  var helpers = require('../tools/helpers.js').getInstance(browser, out);

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
    d.get(h.getStartPage());
    // h.logout()
    // d.get(h.getStartPage());
  });

  afterEach(() => {
    out.groupEnd();
  });

  // currentSpec = it('should get a FreedomSite Db version', h.getHandler(currentSpec, (done) => {
  //   out.log(`Test name: '${currentSpec.description}'`);
  //   db.getData().then(data => {
  //     out.log("The data is: " + data);
  //     done()
  //   });
  // }));

  // currentSpec = it('should have a title', h.getHandler(currentSpec, (done) => {
  //   out.log(`Test name: '${currentSpec.description}'`);
  //   out.log("Verifying title");
  //   expect(d.getTitle()).toContain('mySupermarket');
  //   done()
  // }));

  // currentSpec = it('should login and open a main page', h.getHandler(currentSpec, (done) => {
  //   out.log(`Test name: '${currentSpec.description}'`);
  //   h.login()
  //     .then(() => {
  //       out.log("Verifying ListTitle");
  //       return h.findAndExpectTextContain(mainPageModel.$listTitle, ' Savvy Buys')
  //     })
  //     .then(() => done());
  // }));

  currentSpec = it('should login, open a Product page and use Go to store button', h.getHandler(currentSpec, (done) => {
    out.log(`Test name: '${currentSpec.description}'`);
    h.login()
      .then(() => {
        const productId = testData.goToStore.productIds[1];
        out.log(`Going to Product page #${productId}`);
        return d.get(h.getAbsoluteUrl(pageUrls.getProductPage(productId)));
      })
      .then(() => {
        return h.findAndClick(by.xpath("//div[@class='RedirectToRetailerBtn' and @storeid='1']"))
      })
      .then(() => {
        return d.getAllWindowHandles()
      })
      .then((handles) => {
        c.tabs = handles;
        return d.switchTo().window(c.tabs[1])
      })
      .then(() => {
        return h.findAndWaitForVisible(by.xpath("//span[text()[contains(.,'The Famous Grouse Scotch Whisky 1 Litre')]]"));
      })
      .then(() => {
        return d.close();
      })
      .then(() => {
        const target = c.tabs[0];
        delete c.tabs;
        return d.switchTo().window(target);
      })
      .then(() => done());
  }));

});