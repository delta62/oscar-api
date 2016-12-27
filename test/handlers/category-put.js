const request = require('supertest'),
  { categorySchema } = require('../../src/model/category'),
  { modelFactory } = require('../../src/model/model-factory'),
  jwt = require('jsonwebtoken'),
  api = require('../../src/api');

require('promise-do');

describe('PUT /category', () => {
  let agent;

  before(() => {
    return api.boot()
      .do(api => {
        let Category = modelFactory(api.conn, categorySchema, 'Category');
        return Category.remove({ })
          .then(() => Category.create({ name: 'c1', options: [ 'a' ] }));
      })
      .then(api => agent = request(api));
  })

  it('should return 401 when not authenticated', done => {
    agent.put('/category').expect(401, done);
  });

  it('should return 400 when the request is bad', done => {
    let token = jwt.sign({ admin: true }, 'secret');
    agent
      .put('/category')
      .send([ 1, 2, 3 ])
      .set('Authorization', `Bearer ${token}`)
      .expect(400, done);
  })

  it('should return 403 when not an admin', done => {
    let token = jwt.sign({ admin: false }, 'secret');
    agent
      .put('/category')
      .set('Authorization', `Bearer ${token}`)
      .expect(403, done);
  });

  it('should return 404 when updating an unknown category', done => {
    let token = jwt.sign({ admin: true }, 'secret');
    agent
      .put('/category')
      .send({ name: 'foobar', options: [ 'a' ] })
      .set('Authorization', `Bearer ${token}`)
      .expect(404, done);
  });

  it('should return 200 on success', done => {
    let token = jwt.sign({ admin: true }, 'secret');
    agent
      .put('/category')
      .send({ name: 'c1', options: [ 'a' ] })
      .set('Authorization', `Bearer ${token}`)
      .expect(200, done);
  });
});
