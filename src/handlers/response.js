const { responseModelFactory } = require('../model/response');

exports.browse = function responseBrowseHandler(req, res, next) {
  let Response = responseModelFactory(req.conn);

  Response.find({ username: req.user.username })
    .then(docs => res.json(docs))
    .then(() => next())
    .catch(err => next(err));
};

exports.put = function responsePutHandler(req, res, next) {
  res.send(200);
  next();
};
