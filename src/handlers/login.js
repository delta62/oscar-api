const jwt  = require('jsonwebtoken');
const  { UnauthorizedError } = require('restify');
const  { modelFactory } = require('../model/model-factory');
const  { userSchema } = require('../model/user');

exports.post = function loginHandler(req, res, next) {
  if (!req.body) {
    return next(new UnauthorizedError());
  }

  let User = modelFactory(req.conn, userSchema, 'User');
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
  return Promise.resolve(user);
}

function signToken(user) {
  let body = {
    admin: user.admin,
    username: user.username
  };

  return new Promise((resolve, reject) => {
    jwt.sign(body, 'secret', {}, (err, token) => {
      if (err) return reject(err);
      resolve(token);
    });
  });
}
