// conf.js
exports.config = {
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4445/wd/hub',
  specs: ['spec.js'],
  multiCapabilities: [
    // {
    //   browserName: 'firefox'
    // },
    {
      browserName: 'chrome'
    }
  ],
  jasmineNodeOpts: {
    defaultTimeoutInterval: 300000,
    showColors: true,
    isVerbose: true

  }
}