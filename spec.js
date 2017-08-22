var testData = require('./json/test-data.json');

var out = require('./tools/out.js').instance;
var helpers = require('./tools/helpers.js').instance;

var until = require('selenium-webdriver').until;

describe('MSMS site tests', function () {

  var d = browser.driver;

  var it2 = function (name, test, text) {
    out.group(`Test: '${name}'`);
    it(name, test, text);
  }

  beforeEach(() => {
    d.ignoreSynchronization = true;
    d.get(testData.startPage);
  });

  afterEach(() => {
    out.groupEnd();
  });

  it2('should have a title', () => {
    expect(d.getTitle()).toContain('mySupermarket');
    return Promise.resolve();
  });

  it2('should open a main page', () => {
    return helpers.login(d);
  });

});