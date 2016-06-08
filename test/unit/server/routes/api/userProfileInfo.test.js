'use strict';

var chai = require('chai');
var proxyquire = require('proxyquire');
var sinon = require('sinon');
var _ = require('lodash');
var Promise = require('bluebird');

var nonStrictEquality = require('../../../../utils/nonStrictEquality');
chai.use(nonStrictEquality);

var expect = chai.expect;

var mockDatabase;
var mockCollection;

function createMockCollection(contents) {
  var theCollection = {
    find: sinon.spy(function () {
      return theCollection;
    }),
    sort: sinon.spy(function () {
      return theCollection;
    }),
    findAndModify: sinon.spy(function () {
      return Promise.resolve();
    }),
    insert: sinon.spy(function () {
      return Promise.resolve();
    }),
    toArray: sinon.spy(function () {
      return Promise.resolve(contents);
    })
  };

  return theCollection;
}

function getOrCreateCollection(name) {
  mockCollection[name] = mockCollection[name] || createMockCollection();

  return mockCollection[name];
}

describe('routes/api/userProfileInfo.js', function () {
  var mockRouter;

  function setupMocks() {
    mockCollection = {};

    mockDatabase = {
      connect: sinon.spy(function () {
        return Promise.resolve(mockDatabase);
      }),
      collection: sinon.spy(function (collectionName) {
        return getOrCreateCollection(collectionName);
      })
    };

    mockRouter = {
      use: sinon.spy(),
      get: sinon.spy(),
      post: sinon.spy(),
      put: sinon.spy(),
      delete: sinon.spy()
    };

    var mockExpress = {
      Router: function () {
        return mockRouter;
      }
    };

    global.koe = {
      utils: {
        requireRoot: function () {
          return mockDatabase;
        }
      }, logger: {
        info: function () {
        }
      }
    };

    proxyquire('../../../../../server/routes/api/userProfileInfo', { express: mockExpress });
  }

  beforeEach(setupMocks);

  function getCallIndex(route) {
    return _(mockRouter.get.callCount).times().filter(function (call) {
      return mockRouter.get.getCall(call).calledWith(route);
    })[0];
  }

  function getCall(route) {
    return mockRouter.get.getCall(getCallIndex(route));
  }


  describe('basic routing', function () {
    it('should set a GET route on /getUserProfile', function () {
      expect(mockRouter.get.calledWith('/getUserProfile')).to.be.true;
    });

    it('should set a POST route on /users/:userId/children/:childIndex', function () {
      expect(mockRouter.post.calledWith('/users/:userId/children/:childIndex')).to.be.true;
    });


    ['/users/:userId/userInfo', '/users/:userId/children/:childIndex', '/users/:userId/family/:familyIndex'].forEach(function (route) {
      it('should set a PUT route on' + route, function () {
        expect(mockRouter.put.calledWith(route)).to.be.true;
      });
    });

    ['/users/:userId/family/:familyIndex', '/users/:userId/children/:childIndex'].forEach(function (route) {
      it('should set a DELETE route on ' + route, function () {
        expect(mockRouter.delete.calledWith(route)).to.be.true;
      });
    });
  });

  describe('GET /getUserProfile', function () {
    it('should connect to the db', function (done) {
      var call = getCall('/getUserProfile');
      var callback = call.args[1];

      var mockResponse = {
        send: sinon.spy(function () {

          expect(mockDatabase.connect.called).to.be.true;

          done();
        })
      };
      callback({ user: { username: 'connie' } }, mockResponse);
    });

    it('should access the user collection', function (done) {
      var call = getCall('/getUserProfile');
      var callback = call.args[1];

      var mockResponse = {
        send: sinon.spy(function () {

          expect(mockDatabase.collection.calledWithExactly('usersFamilyChildrenCaseworker')).to.be.true;

          done();
        })
      };
      callback({ user: { username: 'connie' } }, mockResponse);
    });

    it('should access find the profile for the current user', function (done) {
      var call = getCall('/getUserProfile');
      var callback = call.args[1];

      var mockResponse = {
        send: sinon.spy(function () {

          expect(mockCollection.usersFamilyChildrenCaseworker.find.args[0][0]).to.be.nonStrictEqual({ username: 'connie' });

          done();
        })
      };

      callback({ user: { username: 'connie' } }, mockResponse);
    });
  });

});