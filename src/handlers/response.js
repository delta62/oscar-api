const { categoryModelFactory }     = require('../model/category');
const { responseModelFactory }     = require('../model/response');
const { responseValidatorFactory } = require('../validators/response');

exports.browse = function responseBrowseHandler(req, res, next) {
  let Response = responseModelFactory(req.conn);
  Response.find({ username: req.user.username })
    .then(res.json.bind(res))
    .then(next)
    .catch(next);
};

exports.put = function responsePutHandler(req, res, next) {
  let Category = categoryModelFactory(req.conn);
  let Response = responseModelFactory(req.conn);
  responseValidatorFactory(req)
    .do(model => Category.ensureValid(req.params.id, model.value))
    .then(model => Response.findOneAndUpdate(
      { category: req.params.id, username: req.user.username },
      { value: model.value },
      { upsert: true }))
    .then(() => res.send(201))
    .then(next)
    .catch(next);
};
