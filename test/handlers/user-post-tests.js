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
      .send({ name: 'foo bar', email: 'u@u.com' })
      .expect(201, done);
  });

  it('should return 409 when the email is already taken', done => {
    agent.post('/user')
      .send({ name: 'bar baz', email: 'u@u.com' })
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
