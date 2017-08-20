// spec.js
describe('MSMS site tests', function () {

  var until = require('selenium-webdriver').until;
  var EC = protractor.ExpectedConditions;

  var t = 60000;

  // var firstNumber = element(by.model('first'));
  // var secondNumber = element(by.model('second'));
  // var goButton = element(by.id('gobutton'));
  // var latestResult = element(by.binding('latest'));
  // var history = element.all(by.repeater('result in memory'));

  // function add(a, b) {
  //   firstNumber.sendKeys(a.toString());
  //   secondNumber.sendKeys(b.toString());
  //   goButton.click();
  // }

  //   browser.driver.wait(function() {
  //     return browser.driver.findElement(by.id('id'))
  //              .then(function(elem) {
  //                elem.click();
  //                return true;
  //              });
  //  }, timeout_interval);

  beforeEach(function () {
    browser.driver.ignoreSynchronization = true;
    browser.driver.get('https://www.mysupermarket.co.uk/?LandingScript=click::{%22ID%22:%22SignIn%22}');
  });

  // it('should have a title', () => {

  //   expect(browser.driver.getTitle()).toContain('mySupermarket');
  // });

  it('should open a main page', () => {

    let pSwitchToForm = browser.driver.findElement(by.id('iframeForm')).then(elem => {
      console.log('Found iframeForm: ' + elem);
      return browser.driver.switchTo().frame(elem)
    });


    let pLogin = pSwitchToForm.then(() => {
      console.log("Switched to iframeForm");

      return browser.driver.findElement(by.id('Email')).then((elem) => {
        elem.sendKeys('alex.turevski@mysupermarket.com');
        console.log("Filling username");
        return browser.driver.findElement(by.id('PasswordLogin')).then((elem) => {
          elem.sendKeys('manisfree');
          console.log("Filling password");
          return browser.driver.findElement(by.id('SignInButton')).then((elem) => {
            elem.click();
            console.log("Clicking SignInButton");
          });
        });
      });
    });

    let pContinueButton = pLogin.then(() =>
      browser.driver.findElement(by.id('ContinueButton')).then(e => {
        var elContinueButton = e;
        var t = until.elementIsVisible(e);
        console.log("until.elementIsVisible:" + t);
        return browser.driver.wait(t);
      }, t).then(elem => {
        elem.click();
        console.log("Clicking ContinueButton");

        return browser.driver.switchTo().defaultContent().then(() => {
          console.log("Switched to default");

          browser.driver.sleep(3000);

          return Promise.resolve(null);
        });
      }));

    var pStartShoppingBtn = browser.driver.findElement(by.className('StartShoppingBtn')).then((elem) => {
      elem.click();
      console.log("Clicking StartShoppingBtn");

      var elListTitle;
      return browser.driver.findElement(by.id('ListTitle'))
        .then(e => {
          elListTitle = e;
          return browser.driver.wait(until.elementIsVisible(e))
        }, t)
        .then(() => {
          console.log("Finding ListTitle");
          return expect(elListTitle.getText()).toContain(' Top Offers');
        });
    });
  });

});