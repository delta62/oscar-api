const request                  = require('supertest');
const { err }                  = require('../helpers/error');
const { sign }                 = require('../helpers/auth');
const { expect }               = require('code');
const { boot }                 = require('../../src/api');
const { describe, before, it } = require('mocha');

describe('GET /score', () => {
  let agent, token, catId;

  before(() => {
    let Category, Response, User;
    token = sign('user1@foo.com');
    return boot()
      .do(api => Category = api.models.Category)
      .do(api => Response = api.models.Response)
      .do(api => User = api.models.User)
      .do(() => Category.remove({ }))
      .do(() => Category.create({ name: 'c1', options: [ 'a' ], answer: 'a' }))
      .do(() => Category.findOne({ name: 'c1' }).then(cat => catId = cat._id))
      .do(() => Response.remove({ }))
      .do(() => Response.create([
        { email: 'user1@foo.com', category: catId, value: 'a' },
        { email: 'user2@foo.com', category: catId, value: 'a' },
      ]))
      .do(() => User.remove({ }))
      .do(() => User.create({ name: 'User 1', email: 'user1@foo.com' }))
      .do(() => User.create({ name: 'User 2', email: 'user2@foo.com' }))
      .then(api => agent = request(api));
  });

  it('should respond with JSON', done => {
    agent
      .get('/score')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', 'application/json')
      .expect(200, done);
  });

  it('should respond with 401 when not authenticated', done => {
    agent
      .get('/score')
      .expect(401)
      .expect(err('InvalidCredentials'))
      .end(done);
  });

  it('should respond with all users\' scores', done => {
    agent
      .get('/score')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(res => expect(res.body.length).to.equal(2))
      .end(done);
  });

  it('should include the ID of each user', done => {
    agent
      .get('/score')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(res => expect(res.body[0].userId).to.be.a.string())
      .end(done);
  });

  it('should include the total score for each user', done => {
    agent
      .get('/score')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(res => expect(res.body[0].score.totalScore).to.be.a.number())
      .end(done);
  });

  it('should include a detailed breakdown of each response', done => {
    agent
      .get('/score')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(res => expect(res.body[0].score.responses).to.be.an.object())
      .end(done);
  });
});
