'use strict';

const { User } = require('../model/user');

exports.post = function userPostHandler(req, res, next) {
  User.create(req.body)
    .then(() => res.send(201))
    .then(() => next())
    .catch(err => next(err));
};
