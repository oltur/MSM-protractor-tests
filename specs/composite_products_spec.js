var until = require('selenium-webdriver').until;
var mainPageModel = require('../models/main-page-model.js').getInstance();

var db = require('../tools/db.js').getInstance();

describe('MSM site composite products test', function () {

  var testData = require('../json/test-data.json');
  var currentSpec;

  var context = {};
  var out = require('../tools/out.js').getInstance();
  var driver = browser.driver;
  var browser2 = browser.forkNewDriverInstance(false, false);
  var driver2 = browser2.driver;
  var helpers = require('../tools/helpers.js').getInstance(browser, out);
  var helpers2 = require('../tools/helpers.js').getInstance(browser2, out);

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
    
    o.log(`Reading test data from DB`);
    db.getData(testData.db.csFreedomSite, 'select TOP 1 CompositeProductID, Name from DpnCompositeProduct order by CompositeProductID asc')
      .then(recordsets => {
        c.compositeId = recordsets[0][0]["CompositeProductID"];
        c.compositeText = recordsets[0][0]["Name"];
        // // TODO: make configurable
        // c.compositeId = 12000000;
        // c.compositeText = 'Test Bundle with 2 items of different quantity';

        return Promise.all([h.checkStartPage(), h2.checkStartPage()]);
      })
      .then(() => {
        o.log("Opening My Top Offers");
        return d.get(h.getAbsoluteUrl('/shelf/PersonalOffers_my_top_offers'))
      })
      .then(() => {
        o.log(`Finding composite #${c.compositeId}`);
        return h.findAndWaitForVisible(by.xpath('//li[@productid="' + c.compositeId + '"]'))
      })
      .then(productCell => {
        c.productCell = productCell;
        o.log(`Checking if composite has correct text of '${c.compositeText}'`);
        return h.findAndWaitForVisible(by.xpath('//b[text()="' + c.compositeText + '"]'), c.productCell);
      })
      .then(() => {
        o.log("Finding composite Quantity element and getting its text");
        return h.findAndGetText(by.xpath('//span[@class="Quantity"]'), c.productCell)
      })
      .then(quantity => {
        o.log(`Saving composite quantity of ${quantity}`);
        c.quantity = parseInt(quantity);
      })
      .then(() => {
        // TODO: Change to autodiscovery on page
        c.compositePartIds = [3738, 8794];
        c.compositePartQuantities = { [3738]: 1, [8794]: 2 };
        return h2.getProductsDataFromBasket(c.compositePartIds);
      })
      .then(basketQuantities => {
        o.log(`Saving products quantities of composite parts ${JSON.stringify(basketQuantities)}`);
        c.basketQuantities = basketQuantities;
      })
      .then(() => {
        o.log("Adding one more item of composite product to basket");
        return h.findAndClick(by.css('.AddBtnWrp'), c.productCell);
      })
      .then(() => {
        o.log("Waiting a bit and Finding composite Quantity element and Getting its text again");
        d.sleep(3000);
        return h.findAndGetText(by.xpath('//span[@class="Quantity"]'), c.productCell)
      })
      .then(quantity => {
        o.log(`Comparing new composite quantity and old composite quantity plus one (${quantity} vs. ${c.quantity + 1})`);
        expect(parseInt(quantity)).toEqual(c.quantity + 1);

        o.log(`Updating composite quantity of ${quantity}`);
        c.quantity = parseInt(quantity);

        return Promise.resolve(true);
      })
      .then(() => {
        return h2.getProductsDataFromBasket(c.compositePartIds);
      })
      .then(quantities => {
        c.compositePartIds.forEach(element => {
          o.log(`Checking if #${element} quantity (${quantities[element]}) is old #${element} quantity plus ${c.compositePartQuantities[element]} (${parseInt(c.basketQuantities[element]) + c.compositePartQuantities[element]})`);
          expect(parseInt(quantities[element])).toEqual(parseInt(c.basketQuantities[element]) + c.compositePartQuantities[element]);
        })
      })
      .then(() => {
        o.log("Removing one item of composite product from basket");
        return h.findAndClick(by.css('.RemoveBtnWrp'), c.productCell);
      })
      .then(() => {
        o.log("Waiting a bit and Finding composite Quantity element and Getting its text again");
        d.sleep(3000);
        return h.findAndGetText(by.xpath('//span[@class="Quantity"]'), c.productCell)
      })
      .then(quantity => {
        o.log(`Comparing new composite quantity and old composite quantity minus one (${quantity} vs. ${c.quantity - 1})`);
        expect(parseInt(quantity)).toEqual(c.quantity - 1);
      })
      .then(() => done());
  }));
});