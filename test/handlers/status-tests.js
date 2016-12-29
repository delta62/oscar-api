const api    = require('../../src/api'),
  request    = require('supertest'),
  { expect } = require('code');

describe('GET /status', () => {
  let agent;

  before(() => {
    return api.boot().then(api => agent = request(api));
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
