const { userPostValidator } = require('../validators/user');
const { ensureFound }       = require('../util');

exports.userGetHandler = function userGetHandler(req, res, next) {
  Promise.resolve()
    .then(() => this.models.User.findOne({ email: req.user.email }))
    .do(ensureFound)
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
