testData = require('../json/test-data.json');
out = require('./out.js').instance;
until = require('selenium-webdriver').until;

class Helpers {

    constructor() {
    }

    login(d) {
        var result =
            d.findElement(by.id('iframeForm'))
                .then(elem => {
                    out.log('Found iframeForm: ' + elem);
                    return d.switchTo().frame(elem)
                })
                .then(() => {
                    out.log("Switching to iframeForm");
                    return d.findElement(by.id('Email'))
                })
                .then((elem) => {
                    out.log("Filling username");
                    elem.sendKeys(testData.accessData.userName);
                    return d.findElement(by.id('PasswordLogin'))
                }).then((elem) => {
                    out.log("Filling password");
                    elem.sendKeys(testData.accessData.password);
                    return d.findElement(by.id('SignInButton'))
                })
                .then((elem) => {
                    out.log("Clicking SignInButton");
                    return elem.click();
                })
                .then(() => {
                    out.log("Finding ContinueButton");
                    return d.findElement(by.id('ContinueButton'));
                })
                .then(elem => {
                    out.log("Waiting for ContinueButton visibility");
                    return d.wait(until.elementIsVisible(elem)).then(() => Promise.resolve(elem));
                })
                .then(elem => {
                    out.log("Clicking ContinueButton");
                    return elem.click();
                })
                .then(() => {
                    out.log("Switching to default");
                    return d.switchTo().defaultContent();
                })
                .then(() => {
                    d.sleep(5000);
                    out.log("Finding StartShoppingBtn");
                    return d.findElement(by.className('StartShoppingBtn'));
                })
                .then((elem) => {
                    out.log("Clicking StartShoppingBtn");
                    elem.click();
                    return d.findElement(by.id('ListTitle'))
                })
                .then(elem => {
                    return d.wait(until.elementIsVisible(elem)).then(() => Promise.resolve(elem));
                })
                .then(elem => {
                    out.log("Finding ListTitle");
                    return expect(elem.getText()).toContain(' Top Offers');
                });
        return result;
    }
}

exports.instance = new Helpers();