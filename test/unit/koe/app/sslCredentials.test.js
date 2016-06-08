var rewire = require('rewire');
var chai = require('chai');
var sinon = require('sinon');
var uuid = require('node-uuid');

var sslCredentials = rewire('../../../../koe/app/sslCredentials');

var randomObject = require('../../../utils/randomObject');
var expect = chai.expect;

describe('The sslCredentials handler', function () {

  var config;
  var privateKey;
  var certPath;

  beforeEach(function () {
    config = randomObject.newInstance();
    privateKey = config.set('ssl.privateKeyPath');
    certPath = config.set('ssl.certificatePath');
  });

  it('should return undefined if no https port has been configured', function () {
    var cred = sslCredentials({});
    expect(cred).to.be.undefined;
  });

  describe('when an https port has been configured', function () {
    var fs;
    beforeEach(function () {
      fs = {
        readFileSync: sinon.stub()
      };

      config.set('portHttps');
      sslCredentials.__set__('fs', fs);
    });

    describe('and the certificates are present', function () {
      beforeEach(function () {
        fs.readFileSync.withArgs(privateKey).returns(privateKey);
        fs.readFileSync.withArgs(certPath).returns(certPath);
      });

      it('should return an object', function () {
        var cred = sslCredentials(config.getObject());

        expect(cred).to.be.an('object');
      });

      it('with key and cert properties', function () {
        var cred = sslCredentials(config.getObject());

        expect(cred).to.include.all.keys('cert', 'key');
      });

      it('which reference the appropriate files', function () {
        var cred = sslCredentials(config.getObject());

        expect(fs.readFileSync.calledTwice).to.be.true;
        expect(cred.key).to.equal(privateKey);
        expect(cred.cert).to.equal(certPath);
      });
    });

    describe('and the certificate files are misconfigured', function () {
      it('throws an error', function () {
        fs.readFileSync.throws({ code: 'ENOENT' });


        expect(sslCredentials.bind(sslCredentials, config.getObject())).to.throw('Make sure you\'ve created the necessary /ssl/*.pem files.  See readme.');
      });
    });

    describe('and an unhandled error occurs', function () {
      it('rethrows the error', function () {
        var err = { code: uuid.v4() };
        fs.readFileSync.throws(err);

        expect(sslCredentials.bind(sslCredentials, config.getObject())).to.throw(err);
      });
    });
  });
});