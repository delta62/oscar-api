const api          = require('../../src/api'),
  request          = require('supertest'),
  { modelFactory } = require('../../src/model/model-factory'),
  { userSchema }   = require('../../src/model/user');

describe('POST /users', () => {
  let agent;

  before(() => {
    return api.boot()
      .then(api => {
        let User = modelFactory(api.conn, userSchema, 'User');
        return User.remove({ }).then(() => api);
      })
      .then(api => agent = request(api));
  });

  it('should return 201 on success', done => {
    agent.post('/user')
      .send({ name: 'foo', username: 'bar' })
      .expect(201, done);
  });

  it('should return 409 when the username is already taken', done => {
    agent.post('/user')
      .send({ name: 'bar', username: 'bar' })
      .expect(409, done);
  });

  it('should reutrn 400 when input is bad', done => {
    agent.post('/user')
      .send({ shoe: 'banana' })
      .expect(400, done);
  });
});
