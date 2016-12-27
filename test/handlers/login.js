const api = require('../../src/api'),
  { expect } = require('code'),
  { modelFactory } = require('../../src/model/model-factory'),
  { userSchema } = require('../../src/model/user'),
  request = require('supertest');

describe('POST /login', () => {
  let agent;

  before(() => {
    return api.boot()
      .then(api => {
        let User = modelFactory(api.conn, userSchema, 'User');
        return User.remove({ }).then(() => User.create({
          name: 'user',
          username: 'user1'
        }))
        .then(() => api);
      })
      .then(api => agent = request(api));
  });

  it('should return JSON', done => {
    agent.post('/login')
      .send({ username: 'user1' })
      .expect('Content-Type', 'application/json')
      .expect(200, done);
  });

  it('should return an auth token', done => {
    agent.post('/login')
      .send({ username: 'user1' })
      .expect(res => expect(res.body.token).to.be.a.string())
      .end(done);
  });

  it('should return 401 without credentials', done => {
    agent.post('/login').expect(401, done);
  });

  it('should return 401 with invalid credentials', done => {
    agent.post('/login')
      .send({ username: 'somedude' })
      .expect(401, done);
  });
});
