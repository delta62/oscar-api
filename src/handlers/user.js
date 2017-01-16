const { userPostValidator } = require('../validators/user');
const { ensureFound }       = require('../util');

exports.userGetHandler = function userGetHandler(req, res, next) {
  this.models.User
    .findOne({ username: req.user.username })
    .then(res.json.bind(res))
    .then(next)
    .catch(next);
};

exports.userPostHandler = function userPostHandler(req, res, next) {
  userPostValidator(req)
    .then(model => this.models.User.create(model))
    .then(() => res.send(201))
    .then(next)
    .catch(next);
};

exports.userHeadHandler = function userHeadHandler(req, res, next) {
  this.models.User
    .findOne({ username: req.params.email })
    .then(ensureFound)
    .then(() => res.send(200))
    .then(next)
    .catch(next);
};
