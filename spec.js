// spec.js
describe('MSMS site tests', function () {

  var until = require('selenium-webdriver').until;
  var d = browser.driver;
  var t = 60000;

  beforeEach(function () {
    d.ignoreSynchronization = true;
    d.get('https://www.mysupermarket.co.uk/?LandingScript=click::{%22ID%22:%22SignIn%22}');
  });

  it('should have a title', () => {

    expect(d.getTitle()).toContain('mySupermarket');
  });

  it('should open a main page', () => {

    let pSwitchToForm = d.findElement(by.id('iframeForm')).then(elem => {
      console.log('Found iframeForm: ' + elem);
      return d.switchTo().frame(elem)
    });


    let pLogin = pSwitchToForm.then(() => {
      console.log("Switched to iframeForm");

      return d.findElement(by.id('Email')).then((elem) => {
        elem.sendKeys('alex.turevski@mysupermarket.com');
        console.log("Filling username");
        return d.findElement(by.id('PasswordLogin')).then((elem) => {
          elem.sendKeys('manisfree');
          console.log("Filling password");
          return d.findElement(by.id('SignInButton')).then((elem) => {
            elem.click();
            console.log("Clicking SignInButton");
          });
        });
      });
    });

    let pContinueButton = pLogin.then(() =>
      d.findElement(by.id('ContinueButton')).then(e => {
        var elContinueButton = e;
        return d.wait(until.elementIsVisible(e));
      }, t).then(elem => {
        elem.click();
        console.log("Clicking ContinueButton");

        return d.switchTo().defaultContent().then(() => {
          console.log("Switched to default");

          d.sleep(3000);

          return Promise.resolve(null);
        });
      }));

    var pStartShoppingBtn = d.findElement(by.className('StartShoppingBtn')).then((elem) => {
      elem.click();
      console.log("Clicking StartShoppingBtn");

      var elListTitle;
      return d.findElement(by.id('ListTitle'))
        .then(e => {
          elListTitle = e;
          return d.wait(until.elementIsVisible(e))
        }, t)
        .then(() => {
          console.log("Finding ListTitle");
          return expect(elListTitle.getText()).toContain(' Top Offers');
        });
    });
  });

});