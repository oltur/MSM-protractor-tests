"use strict";
var until = require('selenium-webdriver').until;

var Out = require('../tools/out.js');

var Helpers = require('../tools/helpers.js');

describe('Async test', function () {

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

  currentSpec = it('should make screenshot of shelf', h.getHandler(currentSpec, async(done) => {
    out.log(`Test name: 'should make screenshot of shelf'`);
    out.log(`Finding link to branch page`);

    c.element1 = await h.findElement(by.xpath("//a[@href='https://www.auchandrive.fr/drive/nos-drives/p/st-quentin-le-fayet-985']"));
    c.element2 = await h.findElement(by.xpath("//a[@href='https://www.auchandrive.fr/drive/mag/St-Quentin-985/']"))

    out.log(`Mouseovering #1`);
    await browser.driver.actions().mouseMove(c.element1).perform();

    out.log(`Clicking #2`);
    await c.element2.click();

    try {
      out.log(`Trying closing popup`);
      await h.findAndClick(by.css(".close"));
    } catch (error) {

    }

    out.log(`Finding link to shelves page`);
    c.shelves = await h.findElement(by.xpath(
      "(//a[contains(concat(' ',@class,' '),' libelle-rayon ')])[1]"));
    out.log(`Mouseovering shelves`);
    await browser.driver.actions().mouseMove(c.shelves).perform();

    out.log(`Finding link to shelf fruits`);
    d.sleep(3000);
    c.shelves = await h.findElement(by.xpath(
      "(//li[contains(concat(' ',@class,' '),' rayonsMenuHover ')])[4]"));

    out.log(`Mouseovering shelf fruits`);
    await browser.driver.actions().mouseMove(c.shelves).perform();

    out.log(`Taking screenshot`);
    d.sleep(5000);
    let path = 'C:\\Users\\alext\\Desktop\\exception.png';
    await h.takeScreenShot(path);
    done();
  }));

});