const request = require('supertest');
const { err } = require('../helpers/error');
const api = require('../../src/api');
const { expect } = require('code');
const jwt = require('jsonwebtoken');
const { responseModelFactory } = require('../../src/model/response');
const { describe, before, it } = require('mocha');

describe('GET /response', () => {
  let agent,
    token = jwt.sign({ username: 'u' }, 'secret');

  before(() => {
    let Response;
    return api.boot()
      .do(api => Response = responseModelFactory(api.conn))
      .do(() => Response.remove({ }))
      .do(() => Response.create({ username: 'u', category: 'c', value: 'a' }))
      .do(() => Response.create({ username: 'u', category: 'd', value: 'b' }))
      .then(api => agent = request(api));
  });

  it('should respond with JSON', done => {
    agent
      .get('/response')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', 'application/json')
      .end(done);
  });

  it('should respond with 401 when not authenticated', done => {
    agent
      .get('/response')
      .expect(401)
      .expect(err('InvalidCredentials'))
      .end(done);
  });

  it('should respond with multiple responses', done => {
    agent
      .get('/response')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(res => expect(res.body.length).to.equal(2))
      .end(done);
  });

  it('should include the category of each response', done => {
    agent
      .get('/response')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(res => expect(res.body[0].category).to.equal('c'))
      .end(done);
  });

  it('should include the value of each response', done => {
    agent
      .get('/response')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(res => expect(res.body[0].value).to.equal('a'))
      .end(done);
  });
});
