const request                  = require('supertest');
const { boot }                 = require('../../src/api');
const { sign }                 = require('../helpers/auth');
const { err }                  = require('../helpers/error');
const { expect }               = require('code');
const { describe, before, it } = require('mocha');

describe('PUT /response/:categoryId', () => {
  let agent, catId, token, Response;

  before(() => {
    let Category;
    token = sign('user1');

    return boot()
      .do(api => Response = api.models.Response)
      .do(api => Category = api.models.Category)
      .do(() => Response.remove({ }))
      .do(() => Category.remove({ }))
      .do(() => Category.create({ name: 'c', options: [ 'a', 'b', 'c' ] }))
      .do(() => Category.findOne().then(cat => catId = cat.id))
      .then(api => agent = request(api));
  });

  it('should return 401 when not authenticated', done => {
    agent
      .put(`/response/${catId}`)
      .expect(401)
      .expect(err('InvalidCredentials'))
      .end(done);
  });

  it('should respond with JSON', done => {
    agent
      .put(`/response/${catId}`)
      .send({ value: 'a' })
      .set('Authorization', `Bearer ${token}`)
      .expect(201, done);
  });

  it('should create new responses', () => {
    return Response.find({ username: 'user1' })
      .then(docs => expect(docs.length).to.equal(1));
  });

  it('should return 404 when the category doesn\'t exist', done => {
    agent
      .put('/response/58644ded8eb74fa80a65979e')
      .send({ value: 'a' })
      .expect(404)
      .set('Authorization', `Bearer ${token}`)
      .expect(err('NotFoundError'))
      .end(done);
  });

  it('should return 400 when the option doesn\'t exist', done => {
    agent
      .put(`/response/${catId}`)
      .send({ value: 'z' })
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .expect(err('BadRequestError'))
      .end(done);
  });

  it('should set the category of the response', () => {
    return Response.findOne({ username: 'user1' })
      .then(doc => expect(doc.category.toString()).to.equal(catId));
  });

  it('should set the username of the response', () => {
    return Response.findOne({ username: 'user1' })
      .then(doc => expect(doc.username).to.equal('user1'));
  });

  it('should set the value of the response', () => {
    return Response.findOne({ username: 'user1' })
      .then(doc => expect(doc.value).to.equal('a'));
  });

  it('should set the modification date of a new response', () => {
    return Response.findOne({ username: 'user1' })
      .then(doc => expect(doc.updatedAt).to.be.a.date());
  });

  it('should overwrite old responses', done => {
    agent
      .put(`/response/${catId}`)
      .send({ value: 'b' })
      .expect(201)
      .set('Authorization', `Bearer ${token}`)
      .end(done);
  });

  it('should update the modification date of an existing response', () => {
    return Response.findOne({ username: 'user1' })
      .then(doc => expect(doc.updatedAt).to.be.greaterThan(doc.createdAt));
  });
});
