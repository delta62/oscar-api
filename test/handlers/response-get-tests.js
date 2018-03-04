const request                  = require('supertest');
const { err }                  = require('../helpers/error');
const { sign }                 = require('../helpers/auth');
const { boot }                 = require('../../src/api');
const { expect }               = require('code');
const { describe, before, it } = require('mocha');

describe('GET /response', () => {
  let agent, token, catId;

  before(() => {
    let Response, Category;
    token = sign('u@foo.com');
    return boot()
      .do(api => Response = api.models.Response)
      .do(api => Category = api.models.Category)
      .do(() => Category.remove({ }))
      .do(() => Category.create({ name: 'a', options: [ 'a', 'b' ] }))
      .do(() => Category.findOne().then(cat => catId = cat._id))
      .do(() => Response.remove({ }))
      .do(() => Response.create([
        { email: 'u@foo.com', category: catId, value: 'a' },
        { email: 'u@foo.com', category: catId, value: 'b' }
      ]))
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
      .expect(res => expect(res.body[0].category).to.equal(catId.toString()))
      .end(done);
  });

  it('should include the value of each response', done => {
    agent
      .get('/response')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        const answers = res.body.map(r => r.value);
        expect(answers).to.include([ 'a', 'b' ]);
      })
      .end(done);
  });
});
