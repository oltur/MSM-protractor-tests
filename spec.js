var testData = require('./json/test-data.json');
var out = require('./tools/out.js').instance;
var helpers = require('./tools/helpers.js').instance;
var until = require('selenium-webdriver').until;

describe('MSM site tests', function () {

  var d = browser.driver;

  var currentSpec;

  beforeEach(() => {
    out.group();
    d.ignoreSynchronization = true;
    d.get(testData.startPage);
  });

  afterEach(() => {
    out.groupEnd();
  });

  // currentSpec = it('should have a title', (done) => {
  //   out.log(`Test: 'should have a title'`);
  //   expect(d.getTitle()).toContain('mySupermarket');
  //   done()
  // });

  currentSpec = it('should open a main page', (done) => {
    out.log(`Test: ${currentSpec.description}`);
    helpers.login(d).then(() => done());
  });

});