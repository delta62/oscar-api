const request = require('supertest'),
  api = require('../../src/api'),
  { expect } = require('code'),
  jwt = require('jsonwebtoken'),
  { categoryModelFactory } = require('../../src/model/category');

describe('POST /category', () => {
  let agent,
    Category,
    token = jwt.sign({ admin: true }, 'secret');

  before(() => {
    return api.boot()
      .do(api => {
        Category = categoryModelFactory(api.conn);
        return Category.remove({ }).then(Category.create({
          name: 'existing',
          options: [ 'a', 'b', 'c' ]
        }));
      })
      .then(api => agent = request(api));
  });

  it('should 400 when the request is bad', done => {
    agent
      .post('/category')
      .set('Authorization', `Bearer ${token}`)
      .send({ pears: 'apples' })
      .expect(400, done);
  });

  it('should 401 when not authenticated', done => {
    agent
      .post('/category')
      .send({ name: 'unauthorized category creation', options: [ '1' ] })
      .expect(401, done);
  });

  it('should 403 when not an admin', done => {
    let nonAdminToken = jwt.sign({ admin: false }, 'secret');
    agent
      .post('/category')
      .set('Authorization', `Bearer ${nonAdminToken}`)
      .send({ name: 'forbidden category creation', options: [ '1' ] })
      .expect(403, done);
  });

  it('should 409 when a category with the same name exists', done => {
    agent
      .post('/category')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'existing', options: [ 'nope' ] })
      .expect(409, done);
  });

  it('should 201 on success', done => {
    let id = '5863f5994f809d1eeeb762b4';
    agent
      .post('/category')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'new category',
        options: [ 'yes', 'no' ],
        _id: id
      })
      .expect(201, done);
  });

  it('should create a new category', () => {
    return Category.findOne({ name: 'new category' })
      .then(doc => expect(doc).to.exist());
  });

  it('should generate an ID', () => {
    return Category.findOne({ name: 'new category' })
      .then(doc => expect(doc._id).to.be.an.object());
  });

  it('should ignore IDs passed by the user', () => {
    let id = '5863f5994f809d1eeeb762b4';
    return Category.findOne({ name: 'new category' })
      .then(doc => expect(doc._id.toString()).not.to.equal(id))
  });
})
