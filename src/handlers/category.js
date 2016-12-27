'use strict';

const { ForbiddenError, BadRequestError, NotFoundError } = require('restify'),
  { modelFactory } = require('../model/model-factory'),
  { categorySchema } = require('../model/category');

exports.browse = function categoryBrowseHandler(req, res, next) {
  let Category = modelFactory(req.conn, categorySchema, 'Category');
  Category.find({ })
    .then(cats => res.json(cats))
    .then(() => next())
    .catch(err => next(err));
};

exports.put = function categoryPutHandler(req, res, next) {
  if (!req.user.admin) {
    return next(new ForbiddenError());
  }

  let Category = modelFactory(req.conn, categorySchema, 'Category');
  let reqCat = new Category(req.body);
  reqCat.validate()
    .then(() => Category.findOne({ name: reqCat.name }))
    .then(cat => {
      if (!cat) throw new NotFoundError();
      return cat;
    })
    .then(cat => cat.set(reqCat.toJSON()))
    .then(cat => cat.save())
    .then(() => res.send(200))
    .then(() => next())
    .catch(err => next(err));
};
