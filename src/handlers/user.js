'use strict';

const { userSchema } = require('../model/user'),
  { modelFactory } = require('../model/model-factory');

exports.post = function userPostHandler(req, res, next) {
  let User = modelFactory(req.conn, userSchema, 'User');
  User.create(req.body)
    .then(() => res.send(201))
    .then(() => next())
    .catch(err => next(err));
};
