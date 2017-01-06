const { userModelFactory } = require('../model/user');
const { ensureFound } = require('../util');
const { UnauthorizedError } = require('restify');
const { loginValidator } = require('../validators/login');
const { signToken } = require('../services/login');

exports.post = function loginHandler(req, res, next) {
  let User = userModelFactory(req.conn);
  loginValidator(req)
    .then(model => User.findOne({ username: model.username }))
    .do(user => ensureFound(user, new UnauthorizedError()))
    .then(signToken)
    .then(token => res.json({ token }))
    .then(next)
    .catch(next);
};
