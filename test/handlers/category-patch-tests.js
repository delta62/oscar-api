const request = require('supertest'),
  { categoryModelFactory } = require('../../src/model/category'),
  jwt = require('jsonwebtoken'),
  api = require('../../src/api');

require('promise-do');

describe('PATCH /category/:id', () => {
  let agent,
    token = jwt.sign({ admin: true }, 'secret'),
    id,
    Category;

  before(() => {
    return api.boot()
      .do(api => Category = categoryModelFactory(api.conn))
      .do(() => Category.remove({ }))
      .do(() => Category.create({ name: 'c1', options: [ 'a' ] }))
      .do(() => Category.findOne({ name: 'c1' }).then(doc => id = doc.id))
      .then(api => agent = request(api));
  })

  it('should return 401 when not authenticated', done => {
    agent.patch(`/category/${id}`).expect(401, done);
  });

  it('should return 400 when the request is bad', done => {
    agent
      .patch(`/category/${id}`)
      .send({ closed: 'cheesy nachos' })
      .set('Authorization', `Bearer ${token}`)
      .expect(400, done);
  })

  it('should return 403 when not an admin', done => {
    let nonAdminToken = jwt.sign({ admin: false }, 'secret');
    agent
      .patch(`/category/${id}`)
      .set('Authorization', `Bearer ${nonAdminToken}`)
      .expect(403, done);
  });

  it('should return 404 when updating an unknown category', done => {
    agent
      .patch(`/category/58640422292044a2ef71aa0c`)
      .send({ answer: 'a' })
      .set('Authorization', `Bearer ${token}`)
      .expect(404, done);
  });

  it('should return 200 on success', done => {
    let token = jwt.sign({ admin: true }, 'secret');
    agent
      .patch(`/category/${id}`)
      .send({ name: 'c1', options: [ 'a' ] })
      .set('Authorization', `Bearer ${token}`)
      .expect(200, done);
  });
});
