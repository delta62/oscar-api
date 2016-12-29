const request = require('supertest');
const { categoryModelFactory } = require('../../src/model/category');
const { err } = require('../helpers/error');
const { sign } = require('../helpers/auth');
const { boot } = require('../../src/api');
const { describe, before, it } = require('mocha');

require('promise-do');

describe('PATCH /category/:id', () => {
  let agent, token, id, Category;

  before(() => {
    token = sign('admin');
    return boot()
      .do(api => Category = categoryModelFactory(api.conn))
      .do(() => Category.remove({ }))
      .do(() => Category.create({ name: 'c1', options: [ 'a' ] }))
      .do(() => Category.findOne({ name: 'c1' }).then(doc => id = doc.id))
      .then(api => agent = request(api));
  });

  it('should return 401 when not authenticated', done => {
    agent
      .patch(`/category/${id}`)
      .expect(401)
      .expect(err('InvalidCredentials'))
      .end(done);
  });

  it('should return 400 when the request is bad', done => {
    agent
      .patch(`/category/${id}`)
      .send({ closed: 'cheesy nachos' })
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .expect(err('BadRequestError'))
      .end(done);
  });

  it('should return 403 when not an admin', done => {
    let nonAdminToken = sign('user1');
    agent
      .patch(`/category/${id}`)
      .set('Authorization', `Bearer ${nonAdminToken}`)
      .expect(403)
      .expect(err('ForbiddenError'))
      .end(done);
  });

  it('should return 404 when updating an unknown category', done => {
    agent
      .patch('/category/58640422292044a2ef71aa0c')
      .send({ answer: 'a' })
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
      .expect(err('NotFoundError'))
      .end(done);
  });

  it('should return 200 on success', done => {
    let token = sign('admin');
    agent
      .patch(`/category/${id}`)
      .send({ name: 'c1', options: [ 'a' ] })
      .set('Authorization', `Bearer ${token}`)
      .expect(200, done);
  });
});
