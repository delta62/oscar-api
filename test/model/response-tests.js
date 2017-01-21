const mongoose                 = require('mongoose');
const { expect }               = require('code');
const { responseModelFactory } = require('../../src/model/response');
const { describe, before, it } = require('mocha');

describe('Response model', () => {
  let Response;

  before(() => {
    mongoose.Promise = Promise;
    Response = responseModelFactory(mongoose);
  });

  it('should require an email', done => {
    new Response({ }).validate()
      .catch(err => {
        expect(err.errors.email).to.exist();
        done();
      });
  });

  it('should require a category name', done => {
    new Response({ }).validate()
      .catch(err => {
        expect(err.errors.category).to.exist();
        done();
      });
  });

  it('should require a value', done => {
    new Response({ }).validate()
      .catch(err => {
        expect(err.errors.value).to.exist();
        done();
      });
  });

  it('should pass validation with valid data', () => {
    return new Response({
      email: 'user1@foo.com',
      category: '58644ded8eb74fa80a65979e',
      value: 'Elmo'
    }).validate();
  });
});
