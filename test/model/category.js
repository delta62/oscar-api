const mongoose = require('mongoose'),
  { modelFactory } = require('../../src/model/model-factory'),
  { expect } = require('code'),
  { categorySchema } = require('../../src/model/category');

describe('Category model', () => {
  let Category;

  before(() => {
    mongoose.Promise = Promise;
    Category = modelFactory(mongoose, categorySchema, 'Category');
  });

  it('should require name', done => {
    new Category({ })
      .validate()
      .catch(err => {
        expect(err.errors.name).to.exist();
        done();
      });
  });

  it('should require options', done => {
    new Category({  })
      .validate()
      .catch(err => {
        expect(err.errors.options).to.exist();
        done();
      });
  });

  it('should require at least one option to be set', done => {
    new Category({ options: [ ] })
      .validate()
      .catch(err => {
        expect(err.errors.options).to.exist();
        done();
      });
  });

  it('should pass validation with valid data', () => {
    return new Category({ name: 'a', options: [ 'b', 'c' ] }).validate();
  });
});
