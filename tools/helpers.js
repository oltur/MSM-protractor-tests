"use strict";
var _ = require('lodash');
var until = require('selenium-webdriver').until;
var url = require('url');

var LoginModel = require('../models/login-model.js');
var MainPage = require('../models/main-page-model.js');
var PageUrls = require('../models/page-urls-model.js');

var loginModel = new LoginModel();
var mainPage = new MainPage();
var pageUrls = new PageUrls();

var Db = require('../tools/db.js');
var db = new Db();

var testData = require('../json/test-data.json');

const HelpersBase = require('./helpersBase.js');

var fs = require('fs');

class Helpers extends HelpersBase {

    constructor(b, o, c) {
        super(b, o, c);
    }

    takeScreenShot(path) {
        return browser.driver.takeScreenshot()
            .then(png => {
                return this.writeScreenShot(png, path);
            })
    }

    writeScreenShot(data, path) {
        var stream = fs.createWriteStream(path);
        stream.write(new Buffer(data, 'base64'));
        stream.end();
        return Promise.resolve(null);
    }

    clickEveryMenuItem(index) {

        if (!index)
            index = 0;

        return this.d.findElements(by.css("ul.DropDownMenu>li"))
            .then(elements => {

                if (index >= elements.length) {
                    return Promise.resolve(null);
                }

                this.c.element = elements[index];
                return this.d.wait(until.elementIsVisible(this.c.element))
                    .then(() => {
                        return this.c.element.getAttribute("data-shelfid");
                    })
                    .then((attrValue) => {
                        this.o.log(`Clicking menu item of data-shelfid=${attrValue}`);
                        return this.c.element.click();
                    })
                    .then(() => {
                        delete this.c.element;
                        return this.clickEveryMenuItem(index + 1)
                    });
            });
    }

    logoutIfNeeded() {
        this.o.log(`Trying to log out`);
        return this.d.get(this.getStartPage())
            .then(() => {
                return this.findAndClick(by.xpath("//div[@class='UserNameSection']"))
            })
            .then(() => {
                this.d.sleep(2000);
                return this.findAndClick(by.xpath("//li[@class='LinkHover1']/a[@formtype='SignOut']"))
            })
            .then(() => {
                this.d.sleep(1000);
                return this.d.get(this.getStartPage());
            })
            .catch((error) => {
                // error handler
                this.o.log(`Already logged out`);
                return Promise.resolve(null);
            });
    }

    testProductPagesAndGoToStore(productIds, index) {
        if (index >= productIds.length) {
            return Promise.resolve(null);
        }

        if (index > 20) {
            this.o.log(`Stopping after 20 products`);
            return Promise.resolve(null);
        }

        const productId = productIds[index];

        this.o.log(`Going to Product page #${productId}`);
        return this.d.get(this.getAbsoluteUrl(pageUrls.getProductPage(productId)))
            .then(() => {
                //this.o.log(`0a`);
                return this.findAndClick(by.css("div.SeeAllPrices"))
            })
            .then(() => {
                //this.o.log(`1`);
                return this.findAndClick(by.xpath("//div[@class='RedirectToRetailerBtn' and @storeid='1']"))
            })
            .then(() => {
                //                this.o.log(`2`);
                return this.d.getAllWindowHandles()
            })
            .then((handles) => {
                //                this.o.log(`3`);
                this.c.tabs = handles;
                const foreignTab = this.c.tabs[1];
                return this.d.switchTo().window(foreignTab);
            })
            .then(() => {
                //                this.o.log(`4`);
                //return this.findAndWaitForVisible(by.xpath("//span[text()[contains(.,'The Famous Grouse Scotch Whisky 1 Litre')]]"));
                //return this.findAndWaitForVisible(by.xpath("//div"));
                return this.d.getTitle();
            })
            .then((title) => {
                this.o.log(`Going to Tesco page for product #${productId}`);
                //                this.o.log(`5`);
                this.o.log(`Title: ${title}`);
                return this.d.close();
            })
            .then(() => {
                //this.o.log(`6`);
                const target = this.c.tabs[0];
                //delete this.c.tabs;
                return this.d.switchTo().window(target);
            })
            .then(() => {
                //this.o.log(`7`);
                return this.testProductPagesAndGoToStore(productIds, index + 1);
            })
            .catch((error) => {
                // error handler
                //this.o.log(`8`);
                this.o.log(`Product #${productId} not found`);
                return this.testProductPagesAndGoToStore(productIds, index + 1);
            })
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

    findAndGetText(by, root, timeout = undefined) {
        return this.findAndWaitForVisible(by, root, timeout).then(elem => elem.getText());
    }

    findAndClick(by, root, timeout = undefined) {
        return this.findAndWaitForVisible(by, root, timeout).then(elem => elem.click());
    }

    findAndSendKeys(by, keys, root, timeout = undefined) {
        return this.findAndWaitForVisible(by, root, timeout).then(elem => elem.sendKeys(keys));
    }

    findAndExpectTextContain(by, textContain, root, timeout = undefined) {
        return this.findAndWaitForVisible(by, root, timeout).then(elem =>
            expect(elem.getText()).toContain(textContain));
    }

    findAndWaitForVisible(by, root, timeout = undefined) {
        return this.findElement(by, root).then(elem => {
            return this.d.wait(until.elementIsVisible(elem), timeout)
                .then(() => Promise.resolve(elem));
        });
    }

    findElement(by, root) {
        return (root ? root : this.d).findElement(by);
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
                // _.forEach(productIds, productId => {
                //     promises.push(this.getSingleProductDataFromBasket(productId));
                // });

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
            },
            error => {
                return Promise.resolve(0);
            })
    }

    login() {
        this.o.log("Loggin in...");
        // this.o.group("Loggin in...");
        // this.o.log('Finding iframeForm');
        let result = this.findAndSendKeys(loginModel.$Email, testData.accessData.userName)
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
                this.d.sleep(2000);
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

module.exports = Helpers;