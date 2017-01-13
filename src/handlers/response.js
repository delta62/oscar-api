const { responseValidatorFactory } = require('../validators/response');

exports.responseBrowseHandler = function responseBrowseHandler(req, res, next) {
  this.models.Response.find({ username: req.user.username })
    .then(res.json.bind(res))
    .then(next)
    .catch(next);
};

exports.responsePutHandler = function responsePutHandler(req, res, next) {
  let Category = this.models.Category;
  let Response = this.models.Response;
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
