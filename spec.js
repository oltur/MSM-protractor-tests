var testData = require('./json/test-data.json');
var out = require('./tools/out.js').getInstance();
var until = require('selenium-webdriver').until;
var db = require('./tools/db.js').getInstance();

describe('MSM site tests', function () {

  var d = browser.driver;
  var helpers = require('./tools/helpers.js').getInstance(d, out);

  var currentSpec;

  beforeEach(() => {
    out.group();
    d.ignoreSynchronization = true;
    d.get(testData.startPage);
  });

  afterEach(() => {
    out.groupEnd();
  });

  currentSpec = it('should get a FreedomSite Db version', (done) => {
    out.log(`Test name: 'should get a FreedomSite Db version'`);
    db.getData().then(data => {
      out.log("The data is: " + data);
      done()
    });
  });

  currentSpec = it('should have a title', (done) => {
    out.log(`Test name: 'should have a title'`);
    out.log("Verifying title");
    expect(d.getTitle()).toContain('mySupermarket');
    done()
  });

  currentSpec = it('should open a main page', (done) => {
    out.log(`Test name: 'should open a main page'`);
    helpers.login()
      .then(() => {
        out.log("Verifying ListTitle");
        return helpers.findAndExpectTextContain(by.id('ListTitle'), ' Top Offers')
      })
      .then(() => done());
  });

});