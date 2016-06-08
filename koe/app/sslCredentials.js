'use strict';

var fs = require('fs');

function loadCredentials(config) {
  // Use SSL certificates
  try {
    var privateKey = fs.readFileSync(config.ssl.privateKeyPath, 'utf8');
    var certificate = fs.readFileSync(config.ssl.certificatePath, 'utf8');
  } catch(e) {
    if (e.code === 'ENOENT') {
      throw new Error('Make sure you\'ve created the necessary /ssl/*.pem files.  See readme.');
    } else {
      throw e;
    }
  }

  return { key: privateKey, cert: certificate };
}

module.exports = function (config) {
  return config.portHttps ? loadCredentials(config) : undefined;
};
