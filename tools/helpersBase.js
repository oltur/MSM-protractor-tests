"use strict";
var until = require('selenium-webdriver').until;
var url = require('url');

var testData = require('../json/test-data.json');

class HelpersBase {

    constructor(b, o, c) {
        this.b = b;
        this.d = b.driver;
        this.o = o;
        this.c = c;
    }

    selectOptionByText(element, value) {
        var option = element.element(by.xpath(`//option[text()="${value}"]`));
        option.click();
    };
}

module.exports = HelpersBase;