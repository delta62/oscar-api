const api = require('../../src/api'),
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
      .expect(401, done);
  });

  it('should return the current user\'s username', done => {
    agent
      .get('/user')
      .set('Authorization', `Bearer ${token}`)
      .expect(res => expect(res.body.username).to.equal('user1'))
      .expect(200, done);
  });

  it('should return the current user\'s display name', done => {
    agent
      .get('/user')
      .set('Authorization', `Bearer ${token}`)
      .expect(res => expect(res.body.name).to.equal('User One'))
      .expect(200, done);
  });
});
