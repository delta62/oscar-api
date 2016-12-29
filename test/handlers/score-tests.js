const request = require('supertest');
const { err } = require('../helpers/error');
const { sign } = require('../helpers/auth');
const { categoryModelFactory } = require('../../src/model/category');
const { responseModelFactory } = require('../../src/model/response');
const { userModelFactory } = require('../../src/model/user');
const { expect } = require('code');
const { boot } = require('../../src/api');
const { describe, before, it } = require('mocha');

describe('GET /score', () => {
  let agent, token;

  before(() => {
    let Category, Response, User;
    token = sign('user1');
    return boot()
      .do(api => Category = categoryModelFactory(api.conn))
      .do(api => Response = responseModelFactory(api.conn))
      .do(api => User = userModelFactory(api.conn))
      .do(() => Category.remove({ }))
      .do(() => Category.create({ name: 'c1', options: [ 'a' ], answer: 'a' }))
      .do(() => Category.create({ name: 'c2', options: [ 'a' ], answer: 'a' }))
      .do(() => Response.remove({ }))
      .do(() => Response.create([
        { username: 'user1', category: 'c1', value: 'a' },
        { username: 'user1', category: 'c2', value: 'a' },
        { username: 'user2', category: 'c1', value: 'b' },
        { username: 'user2', category: 'c2', value: 'b' },
        { username: 'user3', category: 'c1', value: 'a' },
        { username: 'user4', category: 'c1', value: 'b' },
        { username: 'user5', category: 'c1', value: 'a' },
        { username: 'user5', category: 'c2', value: 'b' }
      ]))
      .do(() => User.remove({ }))
      .do(() => User.create({ name: 'User 1', username: 'user1' }))
      .do(() => User.create({ name: 'User 2', username: 'user2' }))
      .do(() => User.create({ name: 'User 3', username: 'user3' }))
      .do(() => User.create({ name: 'User 4', username: 'user4' }))
      .do(() => User.create({ name: 'User 5', username: 'user5' }))
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
      .expect(res => expect(res.body.length).to.equal(5))
      .end(done);
  });

  it('should include the name of each user', done => {
    agent
      .get('/score')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(res => expect(res.body[0].name).to.be.a.string())
      .end(done);
  });

  it('should include the score for each user', done => {
    agent
      .get('/score')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(res => expect(res.body[0].score).to.be.a.number())
      .end(done);
  });

  it('should score a single correct choice', done => {
    agent
      .get('/score')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(res => expect(scoreUser('User 3', res.body)).to.equal(10))
      .end(done);
  });

  it('should score a single incorrect choice', done => {
    agent
      .get('/score')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(res => expect(scoreUser('User 4', res.body)).to.equal(-1))
      .end(done);
  });

  it('should add multiple correct choices', done => {
    agent
      .get('/score')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(res => expect(scoreUser('User 1', res.body)).to.equal(20))
      .end(done);
  });

  it('should add multiple incorrect choices', done => {
    agent
      .get('/score')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(res => expect(scoreUser('User 2', res.body)).to.equal(-2))
      .end(done);
  });

  it('should add correct & incorrect choices', done => {
    agent
      .get('/score')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(res => expect(scoreUser('User 5', res.body)).to.equal(9))
      .end(done);
  });
});

function scoreUser(name, res) {
  let score = res.find(score => score.name === name);
  return score.score;
}