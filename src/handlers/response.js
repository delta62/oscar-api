const { responseModelFactory } = require('../model/response'),
  { categoryModelFactory } = require('../model/category'),
  { NotFoundError, BadRequestError } = require('restify');

exports.browse = function responseBrowseHandler(req, res, next) {
  let Response = responseModelFactory(req.conn);

  Response.find({ username: req.user.username })
    .then(docs => res.json(docs))
    .then(() => next())
    .catch(err => next(err));
};

exports.put = function responsePutHandler(req, res, next) {
  let Response = responseModelFactory(req.conn);
  let Category = categoryModelFactory(req.conn);

  Category.findById(req.params.id)
    .then(cat => {
      if (!cat) throw new NotFoundError();
      return cat;
    })
    .then(cat => {
      if (!cat.options.includes(req.body.value)) {
        throw new BadRequestError();
      }
      return cat;
    })
    .then(cat => Response.findOneAndUpdate({
      username: req.user.username,
      category: cat.name
    }, {
      username: req.user.username,
      value: req.body.value,
      category: cat.name
    }, {
      upsert: true
    }))
    .then(() => res.send(201))
    .then(() => next())
    .catch(err => next(err));
};
