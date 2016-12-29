const request = require('supertest');
const api = require('../../src/api');
const jwt = require('jsonwebtoken');
const { err } = require('../helpers/error.js');
const { expect } = require('code');
const { modelFactory } = require('../../src/model/model-factory');
const { categorySchema } = require('../../src/model/category');
const { describe, before, it } = require('mocha');

describe('GET /category', () => {
  let agent,
    closed = new Date(2001, 0, 1),
    token = jwt.sign({ admin: false }, 'secret');

  before(() => {
    return api.boot()
      .do(api=> {
        let Category = modelFactory(api.conn, categorySchema, 'Category');
        return Category.remove({ })
          .then(Category.create({
            name: 'c1',
            options: [ 'a', 'b', 'c' ],
            closed,
            answer: 'a'
          }))
          .then(Category.create({ name: 'c2', options: [ 'a' ] }));
      })
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
