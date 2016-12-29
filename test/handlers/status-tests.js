const { boot } = require('../../src/api');
const request = require('supertest');
const { expect } = require('code');
const { describe, before, it } = require('mocha');

describe('GET /status', () => {
  let agent;

  before(() => {
    return boot().then(api => agent = request(api));
  });

  it('should respond with JSON', done => {
    agent.get('/status')
      .expect('Content-Type', 'application/json')
      .expect(200, done);
  });

  it('should include version', done => {
    agent.get('/status')
      .expect(validateVersion)
      .end(done);
  });

  it('should include uptime', done => {
    agent.get('/status')
      .expect(validateUptime)
      .end(done);
  });
});

function validateUptime(res) {
  expect(res.body.uptime).to.be.a.number();
}

function validateVersion(res) {
  expect(res.body.version).to.match(/^\d+\.\d+\.\d+$/);
}
