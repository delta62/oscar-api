const { userPostValidator } = require('../validators/user');
const { sanitizeUser }      = require('../services/user');

function userBrowseHandler(req, res, next) {
  this.models.User.find({ })
    .then(users => users.map(sanitizeUser))
    .then(res.json.bind(res))
    .then(next)
    .catch(next);
}

function userPostHandler(req, res, next) {
  userPostValidator(req)
    .then(model => this.models.User.create(model))
    .then(() => res.send(201))
    .then(next)
    .catch(next);
}

module.exports = {
  userBrowseHandler: userBrowseHandler,
  userPostHandler: userPostHandler
};
