// spec.js
describe('MSMS site tests', function () {

  var t = 5000;
  var d;

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
    d = browser.driver;
    d.ignoreSynchronization = true;
    d.get('https://www.mysupermarket.co.uk/');
  });


  // it('should have a title', () => {

  //   expect(d.getTitle()).toContain('mySupermarket');
  // });

  it('should open a main page', () => {

    d.findElement(By.className('StartShoppingBtn')).then(elem => {
      elem.click();
      console.log('0');
      return true;
    });

    d.findElement(By.id('iframeForm')).then((elem) => {
      d.switchTo().frame("iframeForm");
      console.log('1');
      return true;
    });


    d.wait(() => {
      console.log('2b');
      d.findElement(By.className('ui-dialog-titlebar-close')).then((elem) => {
        console.log('2a');
        elem.click();
        d.switchTo().defaultContent();
        console.log('2');
        return true;
      });
    }, 60000);

    d.findElement(By.id('ListTitle')).then((elem) => {
      expect(elem.getText()).toEqual('my Top Offers');
      return true;
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