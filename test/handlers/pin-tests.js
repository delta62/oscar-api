const { boot }                 = require('../../src/api');
const { expect }               = require('code');
const jwt                      = require('jsonwebtoken');
const request                  = require('supertest');
const { describe, it, before } = require('mocha');

describe('POST /pin', () => {
  let agent;

  before(() => {
    let User, Pin;

    return boot()
      .do(api => User = api.models.User)
      .do(api => Pin = api.models.Pin)
      .do(() => User.remove({ }))
      .do(() => Pin.remove({ }))
      .do(() => User.create({ name: 'user', email: 'user1@foo.com' }))
      .do(() => User.create({ name: 'admin', email: 'admin@foo.com' }))
      .do(() => Pin.create({ email: 'user1@foo.com', pin: '123456' }))
      .do(() => Pin.create({ email: 'admin@foo.com', pin: '1A2B3C' }))
      .then(api => agent = request(api));
  });

  it('should return 200 when given a valid pin', done => {
    agent.post('/pin')
      .send({ email: 'user1@foo.com', pin: '123456' })
      .expect(200, done);
  });

  it('should respond with JSON', done => {
    agent.post('/pin')
      .send({ email: 'user1@foo.com', pin: '123456' })
      .expect(200)
      .expect('Content-Type', 'application/json')
      .end(done);
  });

  it('should respond with an auth token', done => {
    agent.post('/pin')
      .send({ email: 'user1@foo.com', pin: '123456' })
      .expect(200)
      .expect(res => expect(res.body.token).to.be.a.string())
      .end(done);
  });

  it('should return 400 when given a bad response', done => {
    agent.post('/pin')
      .send({ foo: 'bar' })
      .expect(400, done);
  });

  it('should return 401 when given an invalid pin', done => {
    agent.post('/pin')
      .send({ email: 'user1@foo.com', pin: 'ABCDEF' })
      .expect(401)
      .end(done);
  });

  it('should not log non-admin users in as admins', done => {
    agent.post('/pin')
      .send({ email: 'user1@foo.com', pin: '123456' })
      .expect(200)
      .expect(res => expect(jwt.decode(res.body.token).admin).to.be.false())
      .end(done);
  });

  it('should log admin users in as admins', done => {
    agent.post('/pin')
      .send({ email: 'admin@foo.com', pin: '1A2B3C' })
      .expect(200)
      .expect(res => expect(jwt.decode(res.body.token).admin).to.be.true())
      .end(done);
  });
});
