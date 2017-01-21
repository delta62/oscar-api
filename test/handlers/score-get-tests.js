const { describe, it, before } = require('mocha');
const { expect }               = require('code');
const { boot }                 = require('../../src/api');
const request                  = require('supertest');
const { sign }                 = require('../helpers/auth');

describe('GET /score/:id', () => {
  let agent, token, userId;

  before(() => {
    let Category, Response, User, cat1Id, cat2Id;
    token = sign('user1@foo.com');
    return boot()
      .do(api => Category = api.models.Category)
      .do(api => Response = api.models.Response)
      .do(api => User = api.models.User)
      .do(() => Category.remove({ }))
      .do(() => Category.create([
        { name: 'c1', options: [ 'a' ], answer: 'a' },
        { name: 'c2', options: [ 'a' ], answer: 'b' }
      ]))
      .do(() => Category.findOne({ name: 'c1' }).then(cat => cat1Id = cat._id))
      .do(() => Category.findOne({ name: 'c2' }).then(cat => cat2Id = cat._id))
      .do(() => Response.remove({ }))
      .do(() => Response.create([
        { email: 'user1@foo.com', category: cat1Id, value: 'a' },
        { email: 'user1@foo.com', category: cat2Id, value: 'a' }
      ]))
      .do(() => User.remove({ }))
      .do(() => User.create({ name: 'User 1', email: 'user1@foo.com' }))
      .do(() => User.findOne({ email: 'user1@foo.com' })
        .then(u => userId = u._id))
      .then(api => agent = request(api));
  });

  it('should respond with JSON', done => {
    agent.get(`/score/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', 'application/json')
      .expect(200, done);
  });

  it('should return 401 when not authenticated', done => {
    agent.get(`/score/${userId}`).expect(401, done);
  });

  it('should return 404 when asking for an unknown user', done => {
    agent.get('/score/5882cbb238b78c3cc28708ca')
      .set('Authorization', `Bearer ${token}`)
      .expect(404, done);
  });

  it('should return total score', done => {
    agent.get(`/score/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(res => expect(res.body.totalScore).to.equal(14))
      .end(done);
  });

  it('should return question scores', done => {
    agent.get(`/score/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(res => expect(res.body.responses['c1'].score).to.equal(15))
      .end(done);
  });

  it('should include first response score', done => {
    agent.get(`/score/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(res => expect(res.body.responses['c1'].first).to.equal(5))
      .end(done);
  });

  it('should include correct answer score', done => {
    agent.get(`/score/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(res => expect(res.body.responses['c1'].correct).to.equal(10))
      .end(done);
  });

  it('should include incorrect answer score', done => {
    agent.get(`/score/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(res => expect(res.body.responses['c2'].incorrect).to.equal(-1))
      .end(done);
  });
});
