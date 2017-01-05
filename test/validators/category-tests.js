const { ForbiddenError, BadRequestError } = require('restify');
const { expect } = require('code');
const { describe, it } = require('mocha');
const { categoryPatchValidator } = require('../../src/validators/category');

describe.only('category patch validator', () => {
  it('should reject when not given any data', done => {
    categoryPatchValidator(req(null))
      .catch(expectError(BadRequestError, done));
  });

  it('should reject when not given an object', done => {
    categoryPatchValidator(req([ ]))
      .catch(expectError(BadRequestError, done));
  });

  it('should reject when not an admin', done => {
    categoryPatchValidator(req({ }, false))
      .catch(expectError(ForbiddenError, done));
  });

  it('should reject when answer missing from body', done => {
    categoryPatchValidator(req({ closed: '2017-01-01' }))
      .catch(expectError(BadRequestError, done));
  });

  it('should reject when closed missing from body', done => {
    categoryPatchValidator(req({ answer: '' }))
      .catch(expectError(BadRequestError, done));
  });

  it('should reject when closed is not an ISO8601 date', done => {
    categoryPatchValidator(req({ answer: '', closed: 'yep' }))
      .catch(expectError(BadRequestError, done));
  });

  it('should yield parsed model on success', () => {
    let body = { answer: '', closed: '2017-01-01' };
    return categoryPatchValidator(req(body))
      .then(model => expect(model).to.equal(body));
  });
});

function expectError(errType, done) {
  return err => {
    expect(err).to.be.instanceOf(errType);
    done();
  };
}

function req(body, admin = true) {
  return {
    user: {
      admin
    },
    body
  };
}
