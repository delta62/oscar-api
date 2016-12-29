const { userModelFactory } = require('../model/user');

exports.get = function userGetHandler(req, res, next) {
  let User = userModelFactory(req.conn);
  User.findOne({ username: req.user.username })
    .then(res.json.bind(res))
    .then(next)
    .catch(next);
};

exports.post = function userPostHandler(req, res, next) {
  let User = userModelFactory(req.conn);
  User.create(req.body)
    .then(() => res.send(201))
    .then(next)
    .catch(next);
};
