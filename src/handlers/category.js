const { categoryPatchValidator } = require('../validators/category');
const { ensureFound }            = require('../util');

exports.browse = function categoryBrowseHandler(req, res, next) {
  this.models.Category.find({ })
    .then(res.json.bind(res))
    .then(next)
    .catch(next);
};

exports.patch = function categoryPatchHandler(req, res, next) {
  categoryPatchValidator(req)
    .then(model => this.models.Category.findByIdAndUpdate(req.params.id, model))
    .do(ensureFound)
    .then(res.json.bind(res))
    .then(next)
    .catch(next);
};
