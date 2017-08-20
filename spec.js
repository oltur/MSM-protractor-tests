// spec.js
describe('MSMS site tests', function () {

  var until = require('selenium-webdriver').until;

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

    browser.driver.findElement(by.id('iframeForm')).then(elem => {
      console.log('Found iframeForm: ' + elem);
      browser.driver.switchTo().frame(elem).then(() => {
        console.log("Switched to iframeForm");

        browser.driver.findElement(by.id('Email')).sendKeys('alex.turevski@mysupermarket.com').then((elem) => {
          console.log("Filling username");
          browser.driver.findElement(by.id('PasswordLogin')).sendKeys('manisfree').then((elem) => {
            console.log("Filling password");
            browser.driver.findElement(by.id('SignInButton')).click().then((elem) => {
              console.log("Clicking SignInButton");

              browser.driver.findElement(by.id('ContinueButton')).click().then((elem) => {
                console.log("Clicking ContinueButton");

                browser.driver.switchTo().defaultContent().then(() => {
                  console.log("Switched to default");
                  browser.driver.findElement(by.id('ListTitle')).then((elem) => {
                    console.log("Finding ListTitle");
                    expect(elem.getText()).toEqual('my Top Offers');
                  });
                });
              });
            });
          });
        });
      });
    });
  });


  // it('should have a history', function () {
  //   for(const t in Array.from(Array(5).keys())) {
  //     add(t, parseInt(t)+1);
  //   }

  //   expect(history.count()).toEqual(5);

  //   expect(history.last().getText()).toContain('0 + 1');
  // });

  // it('should show an alert', () => {
  //   browser.executeScript('alert("alert")');
  //   var EC = protractor.ExpectedConditions;
  //   // Waits for an alert pops up.
  //   browser.driver.wait(EC.alertIsPresent(), 5000);

  //   var alertDialog = browser.switchTo().alert();

  //   expect(alertDialog.getText()).toEqual("alert");
  // });

});