var until = require('selenium-webdriver').until;
var url = require('url');

var loginModel = require('../models/login-model.js').getInstance();
var mainPageModel = require('../models/main-page-model.js').getInstance();

var testData = require('../json/test-data.json');

class Helpers {

    constructor(b, o) {
        this.b = b;
        this.d = b.driver;
        this.o = o;
    }

    getStartPage() {
        let t = this.getAbsoluteUrl(testData.startPage);
        return t;
    }

    getAbsoluteUrl(relativeUrl) {
        let t = url.resolve(testData.baseUrl, relativeUrl);
        return t;
    }

    getHandler(currentSpec, handler) {
        return handler;
    }

    findAndGetText(by, root) {
        return this.findAndWaitForVisible(by, root).then(elem => elem.getText());
    }

    findAndClick(by, root) {
        return this.findAndWaitForVisible(by, root).then(elem => elem.click());
    }

    findAndSendKeys(by, keys, root) {
        return this.findAndWaitForVisible(by, root).then(elem => elem.sendKeys(keys));
    }

    findAndExpectTextContain(by, textContain, root) {
        return this.findAndWaitForVisible(by, root).then(elem => expect(elem.getText()).toContain(textContain));
    }

    findAndWaitForVisible(by, root) {
        return (root ? root : this.d).findElement(by).then(elem => {
            return this.d.wait(until.elementIsVisible(elem)).then(() => Promise.resolve(elem));
        });
    }

    checkStartPage() {
        let result =
            this.login()
                .then(() => {
                    this.o.log("Verifying ListTitle");
                    return this.findAndExpectTextContain(by.id(mainPageModel.ListTitle), ' Top Offers')
                });
        return result;
    }

    getProductsDataFromBasket(productIds) {
        var promises = [];

        return this.d.get(this.getAbsoluteUrl('/Checkout/ReviewCart.aspx'))
            .then(() => {

                productIds.forEach(productId => {
                    promises.push(this.getSingleProductDataFromBasket(productId));
                });

                return Promise.all(promises)
            })
            .then(data => {
                let result = {};
                for (let i = 0; i < data.length; i++) {
                    result[productIds[i]] = data[i];
                }
                return Promise.resolve(result)
            });
    }

    getSingleProductDataFromBasket(productId) {
        this.o.log(`Getting product #${productId} quantity from Basket page`);
        this.b.waitForAngularEnabled(false);
        return this.d.get(this.getAbsoluteUrl('/Checkout/ReviewCart.aspx'))
            .then(() => {
                return this.findAndWaitForVisible(by.xpath('//li[@productid="' + productId + '"]'))
            })
            .then(pizzaCell => {
                return this.findAndGetText(by.css('.Quantity'), pizzaCell)
            })
    }

    login() {
        this.o.log("Loggin in...");
        // this.o.group("Loggin in...");
        // this.o.log('Finding iframeForm');
        let result =
            this.d.findElement(by.id(loginModel.iframeForm))
                .then(elem => {
                    // this.o.log('Switching to iframeForm');
                    return this.d.switchTo().frame(elem)
                })
                .then(() => {
                    // this.o.log("Filling Email");
                    return this.findAndSendKeys(by.id(loginModel.Email), testData.accessData.userName)
                })
                .then((elem) => {
                    // this.o.log("Filling PasswordLogin");
                    return this.findAndSendKeys(by.id(loginModel.PasswordLogin), testData.accessData.password);
                })
                .then((elem) => {
                    // this.o.log("Clicking SignInButton");
                    return this.findAndClick(by.id(loginModel.SignInButton))
                })
                .then((elem) => {
                    // this.o.log("Clicking ContinueButton");
                    return this.findAndClick(by.id(loginModel.ContinueButton));
                })
                .then((elem) => {
                    // this.o.log("Switching to default context");
                    return this.d.switchTo().defaultContent();
                })
                .then(() => {
                    // this.o.log("Waiting a bit and Clicking StartShoppingBtn");
                    this.d.sleep(3000);
                    //this.o.groupEnd();
                    return this.findAndClick(by.className(loginModel.StartShoppingBtn));
                })
        return result;
    }
}

exports.getInstance = (d, o) => new Helpers(d, o);