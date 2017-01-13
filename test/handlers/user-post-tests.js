const { boot }                 = require('../../src/api');
const { err }                  = require('../helpers/error');
const request                  = require('supertest');
const { describe, before, it } = require('mocha');

describe('POST /users', () => {
  let agent;

  before(() => {
    return boot()
      .do(api => api.models.User.remove({ }))
      .then(api => agent = request(api));
  });

  it('should return 201 on success', done => {
    agent.post('/user')
      .send({ name: 'foo bar', username: 'bar' })
      .expect(201, done);
  });

  it('should return 409 when the username is already taken', done => {
    agent.post('/user')
      .send({ name: 'bar baz', username: 'bar' })
      .expect(409)
      .expect(err('ConflictError'))
      .end(done);
  });

  it('should reutrn 400 when input is bad', done => {
    agent.post('/user')
      .send({ shoe: 'banana' })
      .expect(400)
      .expect(err('BadRequestError'))
      .end(done);
  });
});
