const { responseModelFactory } = require('../model/response');
const  { categoryModelFactory } = require('../model/category');
const  { NotFoundError, BadRequestError } = require('restify');

exports.browse = function responseBrowseHandler(req, res, next) {
  let Response = responseModelFactory(req.conn);

  Response.find({ username: req.user.username })
    .then(res.json.bind(res))
    .then(next)
    .catch(next);
};

exports.put = function responsePutHandler(req, res, next) {
  let Category = categoryModelFactory(req.conn);

  Category.findById(req.params.id)
    .then(cat => {
      if (!cat) throw new NotFoundError();
      return cat;
    })
    .do(cat => {
      if (!cat.options.includes(req.body.value)) {
        throw new BadRequestError();
      }
    })
    .then(cat => upsertResponse(req.conn, req.user.username, cat.name, req.body.value))
    .then(() => res.send(201))
    .then(next)
    .catch(next);
};

function upsertResponse(conn, username, category, value) {
  let Response = responseModelFactory(conn);
  let opts = { upsert: true };
  let query = {
    username,
    category
  };
  let update = {
    username,
    value,
    category
  };

  return Response.findOneAndUpdate(query, update, opts);
}
