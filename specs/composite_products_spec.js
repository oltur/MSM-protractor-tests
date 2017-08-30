var until = require('selenium-webdriver').until;
var mainPageModel = require('../models/main-page-model.js').getInstance();

describe('MSM site composite products test', function () {

  var testData = require('../json/test-data.json');
  var currentSpec;
  
  var context = {};
  var out = require('../tools/out.js').getInstance();
  var driver = browser.driver;
  //var driver2 = browser.forkNewDriverInstance(true).driver;
  var helpers = require('../tools/helpers.js').getInstance(d, o);

  // #region shorthands
  // shorthands
  var c = context;
  var o = out;
  var d = driver;
  //var d2 = driver2;
  var h = helpers
  // #endregion

  beforeEach(() => {
    o.group();
    d.ignoreSynchronization = true;
    d.get(h.getStartPage());
    //d2.get(h.getAbsoluteUrl('/Checkout/ReviewCart.aspx'));
  });

  afterEach(() => {
    o.groupEnd();
  });

  currentSpec = it('should add composite to basket correctly', h.getHandler(currentSpec, (done) => {
    o.log(`Test name: '${currentSpec.description}'`);
    h.prepareMainPage()
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
        o.log(`Saving old quantity of ${quantity}`);
        c.oldQuantity = parseInt(quantity);

        o.log("Adding one more item of composite product to basket");
        return h.findAndClick(by.css('.AddBtnWrp'), c.productCell);
      })
      .then(() => {
        o.log("Waiting a bit and Finding Quantity element and Getting its text again");
        d.sleep(3000);
        return h.findAndGetText(by.xpath('//span[@class="Quantity"]'), c.productCell)
      })
      .then(quantity => {
        o.log(`Comparing new quantity and old quantity plus one (${quantity} vs. ${c.oldQuantity + 1})`);
        expect(parseInt(quantity)).toEqual(c.oldQuantity + 1);
        return Promise.resolve(quantity);
      })
      .then(quantity => {
        o.log(`Updaing old quantity of ${quantity}`);
        c.oldQuantity = parseInt(quantity);

        o.log(`Checking if popup is shown`);
        return h.findAndWaitForVisible(by.css('.MspTooltipInstance'));
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
        o.log(`Comparing new quantity and old quantity minus one (${quantity} vs. ${c.oldQuantity - 1})`);
        expect(parseInt(quantity)).toEqual(c.oldQuantity - 1);
      })
      .then(() => done());
  }));

});