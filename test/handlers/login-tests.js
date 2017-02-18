const { boot }                 = require('../../src/api');
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
      .then(api => agent = request(api));
  });

  it('should return 200 with a known user', done => {
    agent.post('/login')
      .send({ email: 'user1@foo.com' })
      .expect(200, done);
  });

  it('should return 200 with an unknown user', done => {
    agent.post('/login')
      .send({ email: 'thisuserdoesnotexist@evil.com' })
      .expect(200, done);
  });
});
