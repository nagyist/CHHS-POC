'use strict';

module.exports = {
  app_name: koe.config.newRelic.appName,
  license_key: koe.config.newRelic.licenseKey,
  logging: {
    level: koe.config.newRelic.logLevel
  }
};
