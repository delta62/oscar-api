const request = require('supertest');
const { boot } = require('../../src/api');
const { sign } = require('../helpers/auth');
const { err } = require('../helpers/error');
const { expect } = require('code');
const { categoryModelFactory } = require('../../src/model/category');
const { describe, before, it } = require('mocha');

describe('GET /category', () => {
  let agent,
    closed = new Date(2001, 0, 1),
    token;

  before(() => {
    let Category;
    token = sign('user1');
    return boot()
      .do(api=> Category = categoryModelFactory(api.conn))
      .do(() => Category.remove({ }))
      .do(() => Category.create({
        name: 'c1',
        options: [ 'a', 'b', 'c' ],
        closed,
        answer: 'a'
      }))
      .do(() => Category.create({ name: 'c2', options: [ 'a' ] }))
      .then(api => agent = request(api));
  });

  it('should respond with 401 when not logged in', done => {
    agent
      .get('/category')
      .expect(err('InvalidCredentials'))
      .expect(401, done);
  });

  it('should respond with JSON', done => {
    agent
      .get('/category')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', 'application/json')
      .expect(200, done);
  });

  it('should return all of the categories', done => {
    agent
      .get('/category')
      .set('Authorization', `Bearer ${token}`)
      .expect(res => expect(res.body.length).to.equal(2))
      .expect(200, done);
  });

  it('should include the name of each category', done => {
    agent
      .get('/category')
      .set('Authorization', `Bearer ${token}`)
      .expect(res => expect(res.body[0].name).to.equal('c1'))
      .expect(200, done);
  });

  it('should include the time closed categories were closed', done => {
    agent
      .get('/category')
      .set('Authorization', `Bearer ${token}`)
      .expect(res => expect(res.body[0].closed).to.startWith('2001-01-01'))
      .expect(200, done);
  });

  it('should include the options of each category', done => {
    agent
      .get('/category')
      .set('Authorization', `Bearer ${token}`)
      .expect(res => expect(res.body[0].options).to.equal([ 'a', 'b', 'c' ]))
      .expect(200, done);
  });

  it('should include the correct answer for categories', done => {
    agent
      .get('/category')
      .set('Authorization', `Bearer ${token}`)
      .expect(res => expect(res.body[0].answer).to.equal('a'))
      .expect(200, done);
  });
});
