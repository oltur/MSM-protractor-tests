var until = require('selenium-webdriver').until;
var mainPageModel = require('../models/main-page-model.js').getInstance();

describe('MSM site composite products test', function () {

  var testData = require('../json/test-data.json');
  var currentSpec;

  var context = {};
  var out = require('../tools/out.js').getInstance();
  var driver = browser.driver;
  var browser2 = browser.forkNewDriverInstance(false, false);
  var driver2 = browser2.driver;
  var helpers = require('../tools/helpers.js').getInstance(driver, out);
  var helpers2 = require('../tools/helpers.js').getInstance(driver2, out);

  // #region shorthands
  // shorthands
  var c = context;
  var o = out;
  var b = browser;
  var d = driver;
  var b2 = browser2;
  var d2 = driver2;
  var h = helpers;
  var h2 = helpers2;
  // #endregion

  beforeEach(() => {
    o.group();
    d.ignoreSynchronization = true;
    d2.ignoreSynchronization = true;
    b.waitForAngularEnabled(false);
    b2.waitForAngularEnabled(false);
    d.get(h.getStartPage());
    d2.get(h2.getStartPage());
  });

  afterEach(() => {
    o.groupEnd();
  });

  currentSpec = it('should add composite to basket correctly', h.getHandler(currentSpec, (done) => {
    o.log(`Test name: '${currentSpec.description}'`);
    Promise.all([h.checkStartPage(), h2.checkStartPage()])
      .then(() => {
        o.log("Opening My Top Offers");
        return d.get(h.getAbsoluteUrl('/shelf/PersonalOffers_my_top_offers'))
      })
      .then(() => {
        o.log("Finding composite #12000000");
        return h.findAndWaitForVisible(by.xpath('//li[@productid="12000000"]'))
      })
      .then(productCell => {
        c.productCell = productCell;
        o.log("Checking if it has correct text");
        return h.findAndWaitForVisible(by.xpath('//b[text()="Test Bundle with 2 items of different quantity"]'), c.productCell);
      })
      .then(() => {
        o.log("Finding Quantity element and getting its text");
        return h.findAndGetText(by.xpath('//span[@class="Quantity"]'), c.productCell)
      })
      .then(quantity => {
        o.log(`Saving quantity of ${quantity}`);
        c.quantity = parseInt(quantity);
      })
      .then(() => {
        o.log(`Refreshing the Basket page`);
        b2.waitForAngularEnabled(false);
        return d2.get(h2.getAbsoluteUrl('/Checkout/ReviewCart.aspx'));
      })
      .then(() => {
        o.log(`Checking for Pizza Mozarella (productid="3738") in the Basket page`);
        return h2.findAndWaitForVisible(by.xpath('//li[@productid="3738"]'))
      })
      .then(pizzaCell => {
        o.log(`Getting old Pizza Mozarella quantity`);
        return h2.findAndGetText(by.css('.Quantity'), pizzaCell)
      })
      .then(pizzaQuantity => {
        o.log(`Saving Pizza Mozarella quantity of ${pizzaQuantity}`);
        c.pizzaQuantity = parseInt(pizzaQuantity)
      })
      .then(() => {
        o.log("Adding one more item of composite product to basket");
        return h.findAndClick(by.css('.AddBtnWrp'), c.productCell);
      })
      .then(() => {
        o.log("Waiting a bit and Finding Quantity element and Getting its text again");
        d.sleep(3000);
        return h.findAndGetText(by.xpath('//span[@class="Quantity"]'), c.productCell)
      })
      .then(quantity => {
        o.log(`Comparing new quantity and old quantity plus one (${quantity} vs. ${c.quantity + 1})`);
        expect(parseInt(quantity)).toEqual(c.quantity + 1);

        o.log(`Updaing quantity of ${quantity}`);
        c.quantity = parseInt(quantity);

        return Promise.resolve(true);
      })
      .then(() => {
        o.log(`Checking if popup is shown`);
        return h.findAndWaitForVisible(by.css('.MspTooltipInstance'));
      })
      .then(() => {
        o.log(`Refreshing the Basket page`);
        b2.waitForAngularEnabled(false);
        return d2.get(h2.getAbsoluteUrl('/Checkout/ReviewCart.aspx'));
      })
      .then(() => {
        o.log(`Checking for Pizza Mozarella (productid="3738") in the Basket page`);
        return h2.findAndWaitForVisible(by.xpath('//li[@productid="3738"]'))
      })
      .then(pizzaCell => {
        o.log(`Getting new Pizza Mozarella quantity`);
        return h2.findAndGetText(by.css('.Quantity'), pizzaCell)
      })
      .then(pizzaQuantity => {
        o.log(`Checking if Pizza Mozarella's quantity (${pizzaQuantity}) is old Pizza Mozarella's quantity plus one (${c.pizzaQuantity + 1})`);
        expect(parseInt(pizzaQuantity)).toEqual(c.pizzaQuantity + 1);
      })
      .then(() => {
        o.log("Removing one item of composite product from basket");
        return h.findAndClick(by.css('.RemoveBtnWrp'), c.productCell);
      })
      .then(() => {
        o.log("Waiting a bit and Finding Quantity element and Getting its text again");
        d.sleep(3000);
        return h.findAndGetText(by.xpath('//span[@class="Quantity"]'), c.productCell)
      })
      .then(quantity => {
        o.log(`Comparing new quantity and old quantity minus one (${quantity} vs. ${c.quantity - 1})`);
        expect(parseInt(quantity)).toEqual(c.quantity - 1);
      })
      .then(() => done());
  }));

});