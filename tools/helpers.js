"use strict";
var until = require('selenium-webdriver').until;
var url = require('url');

var loginModel = require('../models/login-model.js').getInstance();
var mainPage = require('../models/main-page-model.js').getInstance();
var pageUrls = require('../models/page-urls-model.js').getInstance();

var testData = require('../json/test-data.json');

class Helpers {

    constructor(b, o) {
        this.b = b;
        this.d = b.driver;
        this.o = o;
    }

    logout() {
        return this.d.findElement(by.className('AuthUserName'))
            .then((elem) => {
                return elem.click();
            }, (error) => {
                return Promise.resolve(null);
            })
            .then((elem) => {
                if (!elem) {
                    return Promise.resolve(null);
                }

                return this.d.findElement(by.id('SignOut'))
                    .then((elem) => {
                        return elem.click();
                    })
            });
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
                    return this.findAndWaitForVisible(mainPage.$listTitle)
                });
        return result;
    }

    getProductsDataFromBasket(productIds) {
        var promises = [];

        return this.d.get(this.getAbsoluteUrl(pageUrls.reviewCart))
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
        return this.findAndWaitForVisible(mainPage.$getProductCell(productId))
            .then(pizzaCell => {
                return this.findAndGetText(mainPage.productCell.$quantity, pizzaCell)
            })
    }

    login() {
        this.o.log("Loggin in...");
        // this.o.group("Loggin in...");
        // this.o.log('Finding iframeForm');
        let result =
            // this.d.findElement(loginModel.$iframeForm)
            //     .then(elem => {
            //         // this.o.log('Switching to iframeForm');
            //         return this.d.switchTo().frame(elem)
            //     })
            this.findAndSendKeys(loginModel.$Email, testData.accessData.userName)
                .then((elem) => {
                    // this.o.log("Filling PasswordLogin");
                    return this.findAndSendKeys(loginModel.$PasswordLogin, testData.accessData.password);
                })
                .then((elem) => {
                    // this.o.log("Clicking SignInButton");
                    return this.findAndClick(loginModel.$SignInButton);
                })
                .then((elem) => {
                    // this.o.log("Clicking ContinueButton");
                    return this.findAndClick(loginModel.$ContinueButton);
                })
                // .then((elem) => {
                //     // this.o.log("Switching to default context");
                //     return this.d.switchTo().defaultContent();
                // })
                .then(() => {
                    // this.o.log("Waiting a bit and Clicking StartShoppingBtn");
                    this.d.sleep(3000);
                    //this.o.groupEnd();
                    return this.findAndClick(loginModel.$StartShoppingBtn)
                        .then(() => {
                            return Promise.resolve(true);
                        })
                        .catch(() => {
                            return Promise.resolve(true);
                        });
                })
        return result;
    }
}

exports.getInstance = (d, o) => new Helpers(d, o);