const { userPostValidator } = require('../validators/user');

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
