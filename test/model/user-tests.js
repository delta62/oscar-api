const { userSchema } = require('../../src/model/user');
const { modelFactory } = require('../../src/model/model-factory');
const mongoose = require('mongoose');
const { expect } = require('code');
const { describe, before, it } = require('mocha');

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

  it('should require email', done => {
    new User({ })
      .validate()
      .catch(err => {
        expect(err.errors.email).to.exist();
        done();
      });
  });

  it('should not allow invalid emails', done => {
    new User({ email: '12' })
      .validate()
      .catch(err => {
        expect(err.errors.email).to.exist();
        done();
      });
  });

  it('should accept a valid email', done => {
    new User({ email: 'cheese@gouda.com' })
      .validate()
      .catch(err => {
        expect(err.errors.email).not.to.exist();
        done();
      });
  });

  it('should pass validation with valid data', () => {
    return new User({ name: 'foo', email: 'foo@bar.com' }).validate();
  });
});
