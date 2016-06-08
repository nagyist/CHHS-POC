var rewire = require('rewire');
var chai = require('chai');
var sinon = require('sinon');

var randomObject = require('../../../utils/randomObject');
var config;
var expect = chai.expect;

var renderingEngine = rewire('../../../../koe/app/handlebarsRenderingEngine');

describe('Handlebars rendering engine', function () {
  before(function () {
    config = randomObject.newInstance();
    config.set('handlebars.layoutsDir');
    config.set('handlebars.partialsDir');
    config.set('handlebars.defaultLayout');
    config.set('handlebars.extname');
  });

  it('should return a middleware function', function () {
    var hbs = renderingEngine(config.getObject());
    expect(hbs instanceof Function).to.be.true;
  });

  it('is called with the appropriate config values', function () {
    var spy = sinon.spy();
    renderingEngine.__with__('handlebars', spy)(function () {
      renderingEngine(config.getObject());
      expect(spy.calledOnce).to.be.true;

      var configUsed = spy.args[0][0];
      config.verify('handlebars.layoutsDir', configUsed.layoutsDir);
      config.verify('handlebars.partialsDir', configUsed.partialsDir);
      config.verify('handlebars.defaultLayout', configUsed.defaultLayout);
      config.verify('handlebars.extname', configUsed.extname);
    });
  });
});
