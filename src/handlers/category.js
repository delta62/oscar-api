const { categoryModelFactory } = require('../model/category');
const { ForbiddenError, NotFoundError } = require('restify');

exports.browse = function categoryBrowseHandler(req, res, next) {
  let Category = categoryModelFactory(req.conn);
  Category.find({ })
    .then(res.json.bind(res))
    .then(next)
    .catch(next);
};

exports.patch = function categoryPatchHandler(req, res, next) {
  if (!req.user.admin) {
    return next(new ForbiddenError());
  }

  let Category = categoryModelFactory(req.conn);
  let update = {
    answer: req.body.answer,
    closed: req.body.closed
  };

  Category.findByIdAndUpdate(req.params.id, update, { new: true })
    .then(cat => {
      if (!cat) throw new NotFoundError();
      return cat;
    })
    .then(cat => cat.save())
    .then(res.json.bind(res))
    .then(next)
    .catch(next);
};
