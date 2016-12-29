const { middleware } = require('../../src/middleware/conn');
const { describe, it } = require('mocha');
const { expect } = require('code');

describe('connection middleware', () => {
  it('populates `req.conn` with the server\'s connection', () => {
    let server = { conn: 'connection' };
    let req = { };
    middleware(server)(req);
    expect(req.conn).to.equal(server.conn);
  });
});
