'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'ember-gui',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    apollo: {
      apiURL: 'http://localhost:4000'

      // Optionally, set the credentials property of the Fetch Request interface
      // to control when a cookie is sent:
      // requestCredentials: 'same-origin', // other choices: 'include', 'omit'
    },
    fontawesome: {
        icons: {
          'free-solid-svg-icons': [
                                    'save',
                                    'archive',
                                    'trash-alt',
                                    'arrow-alt-circle-left',
                                    'link',
                                    'expand-arrows-alt',
                                    'bars',
                                    'minus-square',
                                    `plus-square`,
                                    'lightbulb',
                                    'eye',
                                    'expand',
                                    'search-plus'
                                   ]
        }
      }
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
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV;
};
