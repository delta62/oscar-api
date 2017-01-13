const { ensureFound }       = require('../util');
const { UnauthorizedError } = require('restify');
const { loginValidator }    = require('../validators/login');
const { signToken }         = require('../services/login');

exports.loginHandler = function loginHandler(req, res, next) {
  loginValidator(req)
    .then(model => this.models.User.findOne({ username: model.username }))
    .do(user => ensureFound(user, new UnauthorizedError()))
    .then(signToken)
    .then(token => res.json({ token }))
    .then(next)
    .catch(next);
};
