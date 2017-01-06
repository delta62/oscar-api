const { categoryModelFactory }   = require('../model/category');
const { categoryPatchValidator } = require('../validators/category');
const { ensureFound }            = require('../util');

exports.browse = function categoryBrowseHandler(req, res, next) {
  let Category = categoryModelFactory(req.conn);
  Category.find({ })
    .then(res.json.bind(res))
    .then(next)
    .catch(next);
};

exports.patch = function categoryPatchHandler(req, res, next) {
  let Category = categoryModelFactory(req.conn);
  categoryPatchValidator(req)
    .then(model => Category.findByIdAndUpdate(req.params.id, model))
    .do(ensureFound)
    .then(res.json.bind(res))
    .then(next)
    .catch(next);
};
