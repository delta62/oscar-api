const { userModelFactory } = require('../model/user');

exports.get = function userGetHandler(req, res, next) {
  let User = userModelFactory(req.conn);
  User.findOne({ username: req.user.username })
    .then(user => res.json(user))
    .then(() => next())
    .catch(err => next(err));
};

exports.post = function userPostHandler(req, res, next) {
  let User = userModelFactory(req.conn);
  User.create(req.body)
    .then(() => res.send(201))
    .then(() => next())
    .catch(err => next(err));
};
