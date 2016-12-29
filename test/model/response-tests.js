const mongoose = require('mongoose');
const { expect } = require('code');
const { responseModelFactory } = require('../../src/model/response');
const { describe, before, it } = require('mocha');

describe('Response model', () => {
  let Response;

  before(() => {
    mongoose.Promise = Promise;
    Response = responseModelFactory(mongoose);
  });

  it('should require a username', done => {
    Response.create({  })
      .catch(err => {
        expect(err.errors.username).to.exist();
        done();
      });
  });

  it('should require a category name', done => {
    Response.create({  })
      .catch(err => {
        expect(err.errors.category).to.exist();
        done();
      });
  });

  it('should require a value', done => {
    Response.create({  })
      .catch(err => {
        expect(err.errors.value).to.exist();
        done();
      });
  });

  it('should pass validation with valid data', () => {
    return new Response({
      username: 'user1',
      category: 'Best Motion Picture',
      value: 'Elmo'
    }).validate();
  });
});