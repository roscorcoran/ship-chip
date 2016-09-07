/* jshint node: true */

module.exports = function (environment) {
  var ENV = {
    modulePrefix: 'ship-chip-client',
    //The pod structure is the best
    podModulePrefix: 'ship-chip-client/pods',
    environment: environment,
    rootURL: '',
    locationType: 'hash',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },
    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    firebase: {
      apiKey: "AIzaSyDrjTwTt-_KXK8XGZCGy0y_1Ou_NBYmrq0",
      authDomain: "ship-582de.firebaseapp.com",
      databaseURL: "https://ship-582de.firebaseio.com",
      storageBucket: "ship-582de.appspot.com"
    },
    torii: {
      sessionServiceName: 'session'
    }
  };

  /*https://github.com/ebryn/ember-component-css*/
  ENV['ember-component-css'] = {
    namespacing: false
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
