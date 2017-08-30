var testData = require('../json/test-data.json');
var out = require('../tools/out.js').getInstance();
var until = require('selenium-webdriver').until;
var loginModel = require('../models/login-model.js').getInstance();
var mainPageModel = require('../models/main-page-model.js').getInstance();

describe('MSM site composite products test', function () {

  var d = browser.driver;
  var h = require('../tools/helpers.js').getInstance(d, out);

  var currentSpec;

  beforeEach(() => {
    out.group();
    d.ignoreSynchronization = true;
    d.get(testData.startPage);
  });

  afterEach(() => {
    out.groupEnd();
  });

  currentSpec = it('should open a main page', h.getHandler(currentSpec, (done) => {
    out.log(`Test name: '${currentSpec.description}'`);
    h.login()
      .then(() => {
        out.log("Verifying ListTitle");
        return h.findAndExpectTextContain(by.id(mainPageModel.ListTitle), ' Top Offers')
      })
      .then(() => done());
  }));

});