var until = require('selenium-webdriver').until;
var mainPageModel = require('../models/main-page-model.js').getInstance();

describe('MSM site composite products test', function () {

  var testData = require('../json/test-data.json');

  var o = require('../tools/out.js').getInstance();
  var d = browser.driver;
  //var d2 = browser.forkNewDriverInstance(true).driver;
  var h = require('../tools/helpers.js').getInstance(d, o);

  var currentSpec;

  var context = {};

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
      .then(data => {
        o.log("Opening My Top Offers");
        return d.get(h.getAbsoluteUrl('/shelf/PersonalOffers_my_top_offers'))
      })
      .then(data => {
        o.log("Finding composite #12000000");
        return h.findAndWaitForVisible(by.xpath('//li[@productid="12000000"]'))
      })
      .then(productCell => {
        o.log("Checking if it has correct text");
        return h.findAndWaitForVisible(by.xpath('//b[text()="Test Bundle with 2 items of different quantity"]'), productCell)
          .then(elemText => Promise.resolve(productCell));
      })
      .then(productCell => {
        o.log("Finding Quantity element");
        return h.findAndWaitForVisible(by.xpath('//span[@class="Quantity"]'), productCell);
      })
      .then(elemQuantity => {
        o.log("Getting quantity");
        return elemQuantity.getText();
      })
      .then(quantity => {
        o.log("Printing quantity");
        context.quantity = quantity;
        return o.log(`Quantity is ${quantity}`);
      })
      .then(() => done());
  }));

});