// conf.js
exports.config = {
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4445/wd/hub',
  specs: [
    'specs/smoke_test_spec.js',
    'specs/composite_products_spec.js',
  ],
  multiCapabilities: [
    // {
    //   browserName: 'firefox'
    // },
    {
      browserName: 'chrome',
     chromeOptions: {
      args: ['show-fps-counter=true']
      }
    }
  ],
  jasmineNodeOpts: {
    defaultTimeoutInterval: 300000,
    showColors: true,
    isVerbose: true

  }
}