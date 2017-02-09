const { categoryPatchValidator } = require('../validators/category');
const { ensureFound }            = require('../util');

exports.categoryBrowseHandler = function categoryBrowseHandler(req, res, next) {
  this.models.Category.find({ })
    .then(res.json.bind(res))
    .then(next)
    .catch(next);
};

exports.categoryPatchHandler = function categoryPatchHandler(req, res, next) {
  categoryPatchValidator(req)
    .then(model => {
      let id = req.params.id;
      return Promise.resolve()
        .then(() => this.models.Category.findByIdAndUpdate(id, model))
        .do(ensureFound)
        .do(original => {
          if (model.closed && !original.closed) {
            this.sockets.emit('categoryClosed', { categoryId: original._id });
          }
          if (!model.closed && original.closed) {
            this.sockets.emit('categoryOpened', { categoryId: original._id });
          }
          if (model.answer !== original.answer) {
            this.sockets.emit('categoryAnswered', {
              categoryId: original._id, answer: model.answer
            });
          }
        });
    })
    .do(ensureFound)
    .then(res.json.bind(res))
    .then(next)
    .catch(next);
};
