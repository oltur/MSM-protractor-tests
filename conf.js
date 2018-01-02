// conf.js
exports.config = {
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4445/wd/hub',
  specs: [
    //'specs/smoke_test_spec.js',
    // 'specs/product_page_spec.js',
    // 'specs/composite_products_spec.js',
    //'specs/auchan_test_spec.js',
'specs/async_test_spec.js',
  ],
  multiCapabilities: [
    // {
    //   browserName: 'firefox'
    // },
    {
      browserName: 'chrome',
      chromeOptions: {
        args: [
          //'show-fps-counter=true',
          '--start-maximized'
        ],
        
      }
    }
  ],
  jasmineNodeOpts: {
    defaultTimeoutInterval: 15000,//300000,
    showColors: true,
    isVerbose: true

  }
}