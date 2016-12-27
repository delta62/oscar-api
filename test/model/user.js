'use strict';

const { userSchema } = require('../../src/model/user'),
  { modelFactory } = require('../../src/model/model-factory'),
  mongoose     = require('mongoose'),
  { expect }   = require('code');

describe('User model', () => {
  let User;

  before(() => {
    mongoose.Promise = Promise;
    User = modelFactory(mongoose, userSchema, 'User');
  });

  it('should require name', done => {
    new User({ })
      .validate()
      .catch(err => {
        expect(err.errors.name).to.exist();
        done();
      });
  });

  it('should not allow names < 3 characters', done => {
    new User({ name: 'ab' })
      .validate()
      .catch(err => {
        expect(err.errors.name).to.exist();
        done();
      });
  });

  it('should accept a valid name', done => {
    new User({ name: 'cheese' })
      .validate()
      .catch(err => {
        expect(err.errors.name).not.to.exist();
        done();
      });
  });

  it('should require username', done => {
    new User({ })
      .validate()
      .catch(err => {
        expect(err.errors.username).to.exist();
        done();
      });
  });

  it('should not allow usernames < 3 characters', done => {
    new User({ username: '12' })
      .validate()
      .catch(err => {
        expect(err.errors.username).to.exist();
        done();
      });
  });

  it('should restrict username characters', done => {
    new User({ username: '!@#$%^&*()-_=+' })
      .validate()
      .catch(err => {
        expect(err.errors.username).to.exist();
        done();
      });
  });

  it('should accept a valid username', done => {
    new User({ username: 'mister_cheese' })
      .validate()
      .catch(err => {
        expect(err.errors.username).not.to.exist();
        done();
      });
  });

  it('should pass validation with valid data', () => {
    return new User({ name: 'foo', username: 'bar' }).validate();
  });
});
