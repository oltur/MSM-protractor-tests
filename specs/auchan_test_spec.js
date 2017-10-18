"use strict";
var until = require('selenium-webdriver').until;

var Out = require('../tools/out.js');

var Helpers = require('../tools/helpers.js');

describe('Auchan test', function () {

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
    d.get('https://www.auchandrive.fr/drive/prehome/');
    browser.driver.manage().window().maximize();
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

  currentSpec = it('should make screenshot of shelf', h.getHandler(currentSpec, (done) => {
    out.log(`Test name: 'should make screenshot of shelf'`);
    out.log(`Finding link to branch page`);
    return h.findElement(by.xpath("//a[@href='https://www.auchandrive.fr/drive/nos-drives/p/st-quentin-le-fayet-985']"))
      .then((element) => {
        c.element1 = element;
        return Promise.resolve(null);
      })
      .then(() => {
        return h.findElement(by.xpath("//a[@href='https://www.auchandrive.fr/drive/mag/St-Quentin-985/']"))
      })
      .then((element) => {
        c.element2 = element;
        return Promise.resolve(null);
      })
      .then(() => {
        out.log(`Mouseovering #1`);
        return browser.driver.actions().
          mouseMove(c.element1).
          perform();
      })
      .then(() => {
        out.log(`Clicking #2`);
        return c.element2.click();
      })
      .then(() => {
        out.log(`Closing popup`);
        return h.findAndClick(by.css(".close"));
      })
      .then(() => {
        out.log(`Finding link to shelves page`);
        return h.findElement(by.xpath(
          "(//a[contains(concat(' ',@class,' '),' libelle-rayon ')])[1]"));
      })
      .then((element) => {
        out.log(`Mouseovering shelves`);
        c.shelves = element;
        return browser.driver.actions().
          mouseMove(c.shelves).
          perform();
        //return Promise.resolve(null);
      })
      .then(() => {
        out.log(`Finding link to shelf fruits`);
        d.sleep(3000);
        return h.findElement(by.xpath(
          "(//li[contains(concat(' ',@class,' '),' rayonsMenuHover ')])[4]"));
      })
      .then((element) => {
        out.log(`Mouseovering shelf fruits`);
        c.shelves = element;
        return browser.driver.actions().
          mouseMove(c.shelves).
          perform();
        //return Promise.resolve(null);
      })
      .then(() => {
        out.log(`Taking screenshot`);
        d.sleep(5000);
        let path = 'C:\\Users\\alext\\Desktop\\exception.png';
        return h.takeScreenShot(path);
      })
      .then(() => {
        done();
      })
  }));

});