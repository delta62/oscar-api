'use strict';

const jwt  = require('jsonwebtoken'),
  { User } = require('../model/user');

exports.post = function loginHandler(req, res, next) {
  User.findOne({ username: req.body.username })
    .then(signToken)
    .then(token => res.json({ token }))
    .then(() => next())
    .catch(err => next(err));
};

function signToken(user) {
  let body = {
    admin: false,
    name: user.name
  };

  return new Promise((resolve, reject) => {
    jwt.sign(body, 'secret', {}, (err, token) => {
      if (err) return reject(err);
      resolve(token);
    });
  });
}
