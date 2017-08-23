var testData = require('../json/test-data.json');
var until = require('selenium-webdriver').until;
var loginModel = require('../models/login-model.js').getInstance();

class Helpers {

    constructor(d, out) {
        this.d = d;
        this.out = out;
    }

    getHandler(currentSpec, handler) {
        return handler;
    }

    findAndClick(by) {
        return this.findAndWaitForVisible(by).then(elem => elem.click());
    }

    findAndSendKeys(by, keys) {
        return this.findAndWaitForVisible(by).then(elem => elem.sendKeys(keys));
    }

    findAndExpectTextContain(by, textContain) {
        return this.findAndWaitForVisible(by).then(elem => expect(elem.getText()).toContain(textContain));
    }

    findAndWaitForVisible(by) {
        return this.d.findElement(by).then(elem => {
            return this.d.wait(until.elementIsVisible(elem)).then(() => Promise.resolve(elem));
        });
    }

    login() {
        this.out.log('Finding iframeForm');
        var result =
            this.d.findElement(by.id(loginModel.iframeForm))
                .then(elem => {
                    this.out.log('Switching to iframeForm');
                    return this.d.switchTo().frame(elem)
                })
                .then(() => {
                    this.out.log("Filling Email");
                    return this.findAndSendKeys(by.id(loginModel.Email), testData.accessData.userName)
                })
                .then((elem) => {
                    this.out.log("Filling PasswordLogin");
                    return this.findAndSendKeys(by.id(loginModel.PasswordLogin), testData.accessData.password);
                })
                .then((elem) => {
                    this.out.log("Clicking SignInButton");
                    return this.findAndClick(by.id(loginModel.SignInButton))
                })
                .then((elem) => {
                    this.out.log("Clicking ContinueButton");
                    return this.findAndClick(by.id(loginModel.ContinueButton));
                })
                .then((elem) => {
                    this.out.log("Switching to default context");
                    return this.d.switchTo().defaultContent();
                })
                .then(() => {
                    this.d.sleep(5000);
                    this.out.log("Clicking StartShoppingBtn");
                    return this.findAndClick(by.className(loginModel.StartShoppingBtn));
                })
        return result;
    }
}

exports.getInstance = (d, out) => new Helpers(d, out);