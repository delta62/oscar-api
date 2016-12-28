const jwt  = require('jsonwebtoken'),
  { UnauthorizedError } = require('restify'),
  { modelFactory } = require('../model/model-factory'),
  { userSchema } = require('../model/user');

exports.post = function loginHandler(req, res, next) {
  if (!req.body) {
    return next(new UnauthorizedError());
  }

  let User = modelFactory(req.conn, userSchema, 'User');
  User.findOne({ username: req.body.username })
    .then(ensureUser)
    .then(signToken)
    .then(token => res.json({ token }))
    .then(() => next())
    .catch(err => next(err));
};

function ensureUser(user) {
  if (!user) {
    return Promise.reject(new UnauthorizedError());
  }
  return Promise.resolve(user);
}

function signToken(user) {
  let body = {
    admin: false,
    username: user.username
  };

  return new Promise((resolve, reject) => {
    jwt.sign(body, 'secret', {}, (err, token) => {
      if (err) return reject(err);
      resolve(token);
    });
  });
}
