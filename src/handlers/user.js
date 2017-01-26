const { userPostValidator } = require('../validators/user');
const { sanitizeUser }      = require('../services/user');

exports.userBrowseHandler = function userBrowseHandler(req, res, next) {
  this.models.User.find({ })
    .then(users => users.map(sanitizeUser))
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
