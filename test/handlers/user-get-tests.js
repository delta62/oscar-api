const api = require('../../src/api'),
  { err } = require('../helpers/error'),
  { userModelFactory } = require('../../src/model/user'),
  { expect } = require('code'),
  jwt = require('jsonwebtoken'),
  request = require('supertest');

describe('GET /user', () => {
  let agent,
    token = jwt.sign({ admin: false, username: 'user1' }, 'secret');

  before(() => {
    let User;
    return api.boot()
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
