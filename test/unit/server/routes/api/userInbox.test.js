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
    insert: sinon.spy(function () {
      return Promise.resolve();
    }),
    findAndModify: sinon.spy(function () {
      return Promise.resolve();
    }),
    update: sinon.spy(function () {
      return Promise.resolve();
    }),
    remove: sinon.spy(function () {
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

describe('routes/api/userInbox.js', function () {
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

    proxyquire('../../../../../server/routes/api/userInbox', { express: mockExpress });
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
  
  function putCallIndex(route) {
    return _(mockRouter.put.callCount).times().filter(function (call) {
      return mockRouter.put.getCall(call).calledWith(route);
    })[0];
  }

  function putCall(route) {
    return mockRouter.put.getCall(putCallIndex(route));
  }

  function deleteCallIndex(route) {
    return _(mockRouter.delete.callCount).times().filter(function (call) {
      return mockRouter.delete.getCall(call).calledWith(route);
    })[0];
  }

  function deleteCall(route) {
    return mockRouter.delete.getCall(deleteCallIndex(route));
  }

  describe('basic routing', function () {
    ['/inbox/:userId/:sequenceId', '/sentInbox/:userId/:sequenceId'].forEach(function (route) {
      it('should set a GET route on ' + route, function () {
        expect(mockRouter.get.calledWith(route)).to.be.true;
      });
    });

    it('should set a POST route on /inbox/:userId/:sequenceId', function () {
      expect(mockRouter.post.calledWith('/inbox/:userId/:sequenceId')).to.be.true;
    });

    it('should set a PUT route on /inbox/:userId/:sequenceId', function () {
      expect(mockRouter.post.calledWith('/inbox/:userId/:sequenceId')).to.be.true;
    });
  });

  describe('GET /inbox/:userId/:sequenceId', function () {
    it('should connect to the db', function (done) {
      var call = getCall('/inbox/:userId/:sequenceId');
      var callback = call.args[1];

      var mockResponse = {
        send: sinon.spy(function () {

          expect(mockDatabase.connect.called).to.be.true;

          done();
        })
      };
      callback({ user: { username: 'connie' } }, mockResponse);
    });

    it('should access the inbox collection', function (done) {
      var call = getCall('/inbox/:userId/:sequenceId');
      var callback = call.args[1];

      var mockResponse = {
        send: sinon.spy(function () {

          expect(mockDatabase.collection.calledWithExactly('inbox')).to.be.true;

          done();
        })
      };
      callback({ user: { username: 'connie' } }, mockResponse);
    });

    it('should access find the messages for the current user', function (done) {
      var call = getCall('/inbox/:userId/:sequenceId');
      var callback = call.args[1];

      var mockResponse = {
        send: sinon.spy(function () {

          expect(mockCollection.inbox.find.args[0][0]).to.be.nonStrictEqual({to: 'connie'});

          done();
        })
      };

      callback({ user: { username: 'connie' } }, mockResponse);
    });


    it('should sort messages by date', function (done) {
      var call = getCall('/inbox/:userId/:sequenceId');
      var callback = call.args[1];

      var mockResponse = {
        send: sinon.spy(function () {

          expect(mockCollection.inbox.sort.args[0][0]).to.be.nonStrictEqual({sent: -1});

          done();
        })
      };

      callback({ user: { username: 'connie' } }, mockResponse);
    });

    it('should return all your messages', function (done) {
      var messages = [{ to: 'me', from: 'you' }];

      mockCollection.inbox = createMockCollection(messages);


      var call = getCall('/inbox/:userId/:sequenceId');
      var callback = call.args[1];

      var mockResponse = {
        send: sinon.spy(function () {

          expect(mockResponse.send.args[0][0]).to.be.nonStrictEqual(messages);

          done();
        })
      };
      callback({ user: { username: 'connie' } }, mockResponse);
    });
  });
  
  describe('GET /sentInbox/:userId/:sequenceId', function () {
    it('should connect to the db', function (done) {
      var call = getCall('/sentInbox/:userId/:sequenceId');
      var callback = call.args[1];

      var mockResponse = {
        send: sinon.spy(function () {

          expect(mockDatabase.connect.called).to.be.true;

          done();
        })
      };
      callback({ user: { username: 'connie' } }, mockResponse);
    });

    it('should access the sent inbox collection', function (done) {
      var call = getCall('/sentInbox/:userId/:sequenceId');
      var callback = call.args[1];

      var mockResponse = {
        send: sinon.spy(function () {

          expect(mockDatabase.collection.calledWithExactly('sentInbox')).to.be.true;

          done();
        })
      };
      callback({ user: { username: 'connie' } }, mockResponse);
    });

    it('should access find the sent messages for the current user', function (done) {
      var call = getCall('/sentInbox/:userId/:sequenceId');
      var callback = call.args[1];

      var mockResponse = {
        send: sinon.spy(function () {

          expect(mockCollection.sentInbox.find.args[0][0]).to.be.nonStrictEqual({from: 'connie'});

          done();
        })
      };

      callback({ user: { username: 'connie' } }, mockResponse);
    });


    it('should sort sent messages by date', function (done) {
      var call = getCall('/sentInbox/:userId/:sequenceId');
      var callback = call.args[1];

      var mockResponse = {
        send: sinon.spy(function () {

          expect(mockCollection.sentInbox.sort.args[0][0]).to.be.nonStrictEqual({sent: -1});

          done();
        })
      };

      callback({ user: { username: 'connie' } }, mockResponse);
    });

    it('should return all your sent messages', function (done) {
      var messages = [{ to: 'me', from: 'you' }];

      mockCollection.sentInbox = createMockCollection(messages);


      var call = getCall('/sentInbox/:userId/:sequenceId');
      var callback = call.args[1];

      var mockResponse = {
        send: sinon.spy(function () {

          expect(mockResponse.send.args[0][0]).to.be.nonStrictEqual(messages);

          done();
        })
      };
      callback({ user: { username: 'connie' } }, mockResponse);
    });
  });


  describe('PUT /inbox/:userId/:sequenceId', function () {
    it('should update read inbox messages', function (done) {
      var call = putCall('/inbox/:userId/:sequenceId');
      var callback = call.args[1];
      var bodyInfo = [{_id: "5755a33e358b8d0c00f4f57c", from: "me", to: "you"}];
      var ids = "5755a33e358b8d0c00f4f57c";
      var mockResponse = {
        send: sinon.spy(function () {

          expect(mockDatabase.connect.called).to.be.true;
          expect(mockDatabase.collection.calledWithExactly('inbox')).to.be.true;
          expect(mockCollection.inbox.update.args[0][0]).to.be.nonStrictEqual({"_id": ids},{$set:{'unread':0}});
          expect(mockResponse.send.calledWithExactly()).to.be.true;

          done();
        }),
        status:  sinon.spy(function () { return mockResponse; }),
        end: sinon.spy(function(){done();})
      };
      callback({ user: { username: 'connie' }, body: bodyInfo }, mockResponse);
    });
  });

  describe('DELETE /inbox/:userId/:sequenceId', function () {
    it('should delete inbox messages', function (done) {
      var call = deleteCall('/inbox/:userId/:sequenceId');
      var callback = call.args[1];
      var bodyInfo = [{_id: "5755a33e358b8d0c00f4f57c", from: "me", to: "you"}];
      var ids = "5755a33e358b8d0c00f4f57c";

      var mockResponse = {
        send: sinon.spy(function () {

          expect(mockDatabase.connect.called).to.be.true;
          expect(mockDatabase.collection.calledWithExactly('inbox')).to.be.true;
          expect(mockCollection.inbox.remove.args[0][0]).to.be.nonStrictEqual({_id:{$in:ids}});
          expect(mockResponse.send.calledWithExactly()).to.be.true;

          done();
        }),
        status:  sinon.spy(function () { return mockResponse; }),
        end: sinon.spy(function(){done();})
      };
      callback({ user: { username: 'connie' }, body: bodyInfo }, mockResponse);
    });
  });

  describe('DELETE /sentInbox/:userId/:sequenceId', function () {
    it('should delete sent inbox messages', function (done) {
      var call = deleteCall('/sentInbox/:userId/:sequenceId');
      var callback = call.args[1];
      var bodyInfo = [{_id: "5755a33e358b8d0c00f4f57c", from: "me", to: "you"}];
      var ids = "5755a33e358b8d0c00f4f57c";

      var mockResponse = {
        send: sinon.spy(function () {

          expect(mockDatabase.connect.called).to.be.true;
          expect(mockDatabase.collection.calledWithExactly('sentInbox')).to.be.true;
          expect(mockCollection.inbox.remove.args[0][0]).to.be.nonStrictEqual({_id:{$in:ids}});
          expect(mockResponse.send.calledWithExactly()).to.be.true;
          
          done();
        }),
        status:  sinon.spy(function () { return mockResponse; }),
        end: sinon.spy(function(){done();})
      };
      callback({ user: { username: 'connie' }, body: bodyInfo }, mockResponse);
    });
  });
});