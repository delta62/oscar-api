const { reqConnFactory } = require('../../src/middleware/conn');
const { beforeEach, describe, it } = require('mocha');
const { expect } = require('code');

describe('connection middleware', () => {
  let server, req, res;

  beforeEach(() => {
    server = { conn: 'connection' };
    req = { };
    res = { };
  });

  it('populates `req.conn` with the server\'s connection', done => {
    reqConnFactory(server)(req, res, () => {
      expect(req.conn).to.equal(server.conn);
      done();
    });
  });

  it('should call next', done => {
    reqConnFactory(server)(req, res, done);
  });
});
