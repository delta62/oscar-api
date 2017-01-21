const { boot }                 = require('../../src/api');
const { err }                  = require('../helpers/error');
const jwt                      = require('jsonwebtoken');
const { expect }               = require('code');
const request                  = require('supertest');
const { describe, before, it } = require('mocha');

describe('POST /login', () => {
  let agent;

  before(() => {
    let User;
    return boot()
      .do(api => User = api.models.User)
      .do(() => User.remove({ }))
      .do(() => User.create({ name: 'user', email: 'user1@foo.com' }))
      .do(() => User.create({ name: 'admin', email: 'admin@foo.com' }))
      .then(api => agent = request(api));
  });

  it('should return JSON', done => {
    agent.post('/login')
      .send({ email: 'user1@foo.com' })
      .expect('Content-Type', 'application/json')
      .expect(200, done);
  });

  it('should return an auth token', done => {
    agent.post('/login')
      .send({ email: 'user1@foo.com' })
      .expect(res => expect(res.body.token).to.be.a.string())
      .end(done);
  });

  it('should return 401 without credentials', done => {
    agent
      .post('/login')
      .expect(401)
      .expect(err('UnauthorizedError'))
      .end(done);
  });

  it('should return 401 with invalid credentials', done => {
    agent.post('/login')
      .send({ email: 'somedude@example.com' })
      .expect(401)
      .expect(err('UnauthorizedError'))
      .end(done);
  });

  it('should not log normal users in as admins', done => {
    agent.post('/login')
      .send({ email: 'user1@foo.com' })
      .expect(200)
      .expect(res => expect(jwt.decode(res.body.token).admin).to.be.false())
      .end(done);
  });

  it('should log whitelisted users in as an admin', done => {
    agent.post('/login')
      .send({ email: 'admin@foo.com' })
      .expect(200)
      .expect(res => expect(jwt.decode(res.body.token).admin).to.be.true())
      .end(done);
  });
});
