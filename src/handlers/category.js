'use strict';

const restify  = require('restify'),
  { Category } = require('../model/category');

exports.browse = function categoryBrowseHandler(req, res, next) {
  Category.find({})
    .then(cats => res.json(cats))
    .then(() => next())
    .catch(err => next(err));
};

exports.put = function categoryPutHandler(req, res, next) {
  if (!req.user.admin) {
    throw new restify.UnauthorizedException();
  }

  Category.findOne({ name: req.body.name })
    .then(cat => {
      if (!cat) throw new restify.NotFoundError();
      cat.set('closed', req.body.closed ? new Date() : null);
      return cat.save();
    })
    .then(() => next())
    .catch(err => next(err));
};
