const jwt  = require('jsonwebtoken');
const config = require('config');
const { UnauthorizedError } = require('restify');
const { userModelFactory } = require('../model/user');

exports.post = function loginHandler(req, res, next) {
  if (!req.body) {
    return next(new UnauthorizedError());
  }

  let User = userModelFactory(req.conn);
  User.findOne({ username: req.body.username })
    .then(ensureUser)
    .then(signToken)
    .then(token => res.json({ token }))
    .then(next)
    .catch(next);
};

function ensureUser(user) {
  if (!user) {
    return Promise.reject(new UnauthorizedError());
  }
  return user;
}

function signToken(user) {
  let body = {
    admin: user.admin,
    username: user.username
  };

  return new Promise((resolve, reject) => {
    jwt.sign(body, config.get('auth.secret'), { }, (err, token) => {
      if (err) return reject(err);
      resolve(token);
    });
  });
}
