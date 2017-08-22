out = require('./out.js').instance;
until = require('selenium-webdriver').until;
testData = require('../json/test-data.json');

class Helpers {

    constructor() {
    }

    login(d) {
        let pSwitchToForm = d.findElement(by.id('iframeForm')).then(elem => {
            out.log('Found iframeForm: ' + elem);
            return d.switchTo().frame(elem)
        });


        let pLogin = pSwitchToForm.then(() => {
            out.log("Switched to iframeForm");

            return d.findElement(by.id('Email')).then((elem) => {
                elem.sendKeys(testData.accessData.userName);
                out.log("Filling username");
                return d.findElement(by.id('PasswordLogin')).then((elem) => {
                    elem.sendKeys(testData.accessData.password);
                    out.log("Filling password");
                    return d.findElement(by.id('SignInButton')).then((elem) => {
                        elem.click();
                        out.log("Clicking SignInButton");
                    });
                });
            });
        });

        let pContinueButton = pLogin.then(() =>
            d.findElement(by.id('ContinueButton')).then(e => {
                var elContinueButton = e;
                return d.wait(until.elementIsVisible(e));
            }, testData.timeout).then(elem => {
                elem.click();
                out.log("Clicking ContinueButton");

                return d.switchTo().defaultContent().then(() => {
                    out.log("Switched to default");

                    d.sleep(3000);

                    return Promise.resolve(null);
                });
            }));

        var pStartShoppingBtn = d.findElement(by.className('StartShoppingBtn')).then((elem) => {
            elem.click();
            out.log("Clicking StartShoppingBtn");

            var elListTitle;
            return d.findElement(by.id('ListTitle'))
                .then(e => {
                    elListTitle = e;
                    return d.wait(until.elementIsVisible(e))
                }, testData.timeout)
                .then(() => {
                    out.log("Finding ListTitle");
                    return expect(elListTitle.getText()).toContain(' Top Offers');
                });
        });

        return pStartShoppingBtn;
    }

}

exports.instance = new Helpers();