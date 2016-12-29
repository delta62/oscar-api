const { boot } = require('../../src/api');
const { err } = require('../helpers/error');
const { sign } = require('../helpers/auth');
const { userModelFactory } = require('../../src/model/user');
const { expect } = require('code');
const request = require('supertest');
const { describe, before, it } = require('mocha');

describe('GET /user', () => {
  let agent, token;

  before(() => {
    let User;
    token = sign('user1');
    return boot()
      .do(api => User = userModelFactory(api.conn))
      .do(() => User.remove({ }))
      .do(() => User.create({ username: 'user1', name: 'User One' }))
      .then(api => agent = request(api));
  });

  it('should respond with JSON', done => {
    agent
      .get('/user')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', 'application/json')
      .expect(200, done);
  });

  it('should return 401 when not authenticated', done => {
    agent
      .get('/user')
      .expect(401)
      .expect(err('InvalidCredentials'))
      .end(done);
  });

  it('should return the current user\'s username', done => {
    agent
      .get('/user')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(res => expect(res.body.username).to.equal('user1'))
      .end(done);
  });

  it('should return the current user\'s display name', done => {
    agent
      .get('/user')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(res => expect(res.body.name).to.equal('User One'))
      .end(done);
  });
});
