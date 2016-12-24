'use strict';

const { Category } = require('../model/category');

exports.browse = function categoryBrowseHandler(req, res, next) {
  Category.find({})
    .then(cats => res.json(cats))
    .then(() => next())
    .catch(err => next(err));
};
