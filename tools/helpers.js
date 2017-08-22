testData = require('../json/test-data.json');
until = require('selenium-webdriver').until;

class Helpers {

    constructor(d, out) {
        this.d = d;
        this.out = out;
    }

    findAndClick(by) {
        return this.findAndWaitForVisible(by).then(elem => elem.click());
    }

    findAndWaitForVisible(by) {
        return this.d.findElement(by).then(elem => {
            return this.d.wait(until.elementIsVisible(elem)).then(() => Promise.resolve(elem));
        });
    }

    login() {
        var result =
            this.d.findElement(by.id('iframeForm'))
                .then(elem => {
                    this.out.log('Found iframeForm: ' + elem);
                    return this.d.switchTo().frame(elem)
                })
                .then(() => {
                    this.out.log("Switching to iframeForm");
                    return this.d.findElement(by.id('Email'))
                })
                .then((elem) => {
                    this.out.log("Filling username");
                    elem.sendKeys(testData.accessData.userName);
                    return this.d.findElement(by.id('PasswordLogin'))
                }).then((elem) => {
                    this.out.log("Filling password");
                    elem.sendKeys(testData.accessData.password);
                    return this.d.findElement(by.id('SignInButton'))
                })
                .then((elem) => {
                    this.out.log("Clicking SignInButton");
                    return elem.click();
                })
                .then(() => {
                    this.out.log("Finding ContinueButton");
                    return this.d.findElement(by.id('ContinueButton'));
                })
                .then(elem => {
                    this.out.log("Waiting for ContinueButton visibility");
                    return this.d.wait(until.elementIsVisible(elem)).then(() => Promise.resolve(elem));
                })
                .then(elem => {
                    this.out.log("Clicking ContinueButton");
                    return elem.click();
                })
                .then(() => {
                    this.out.log("Switching to default");
                    return this.d.switchTo().defaultContent();
                })
                .then(() => {
                    this.d.sleep(5000);
                    this.out.log("Finding and clicking StartShoppingBtn");
                    return this.findAndClick(by.className('StartShoppingBtn'));
                })
                .then(() => {
                    this.out.log("Finding ListTitle");
                    return this.findAndWaitForVisible(by.id('ListTitle'))
                })
                .then(elem => {
                    this.out.log("Checking text of Top Offers");
                    return expect(elem.getText()).toContain(' Top Offers');
                });
        return result;
    }
}

exports.getInstance = (d) => new Helpers(d);