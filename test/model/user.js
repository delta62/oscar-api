'use strict';

const { User } = require('../../src/model/user'),
  mongoose     = require('mongoose'),
  { expect }   = require('code');

describe('User model', () => {
  before(() => {
    mongoose.Promise = Promise;
  });

  it('should require name', () => {
    return new User({ }).validate(err => {
      expect(err.errors.name).to.exist();
    });
  });

  it('should not allow names < 3 characters', () => {
    return new User({ name: 'ab' }).validate(err => {
      expect(err.errors.name).to.exist();
    });
  });

  it('should accept a valid name', () => {
    return new User({ name: 'cheese' }).validate(err => {
      expect(err.errors.name).not.to.exist();
    });
  });

  it('should require username', () => {
    return new User({ }).validate(err => {
      expect(err.errors.username).to.exist();
    });
  });

  it('should not allow usernames < 3 characters', () => {
    return new User({ username: '12' }).validate(err => {
      expect(err.errors.username).to.exist();
    });
  });

  it('should restrict username characters', () => {
    return new User({ username: '!@#$%^&*()-_=+' }).validate(err => {
      expect(err.errors.username).to.exist();
    });
  });

  it('should accept a valid username', () => {
    return new User({ username: 'mister_cheese' }).validate(err => {
      expect(err.errors.username).not.to.exist();
    });
  });

  it('should pass validation with valid data', () => {
    return new User({ name: 'foo', username: 'bar' }).validate(err => {
      expect(err.errors).to.equal([ ]);
    });
  });
});
