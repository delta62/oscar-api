'use strict';

const { Category } = require('../model/category');

exports.browse = function categoryBrowseHandler(req, res, next) {
  res.json([ ]);
  next();
};
