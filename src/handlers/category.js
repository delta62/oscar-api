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
    .then(updated => {
      let id = req.params.id, original, opts = { new: true };

      return Promise.resolve(id)
        .then(id => this.models.Category.findById(id))
        .do(ensureFound)
        .then(doc => {
          original = doc;

          let ret = { };
          if (updated.answer) ret.answer = updated.answer;
          if (updated.closed && !original.closed) ret.closed = new Date();
          if (!updated.closed && original.closed) ret.closed = null;

          return ret;
        })
        .then(model => this.models.Category.findByIdAndUpdate(id, model, opts))
        .do(endState => {
          if (endState.closed && !original.closed) {
            this.sockets.emit('categoryClosed', { categoryId: id });
          }
          if (!endState.closed && original.closed) {
            this.sockets.emit('categoryOpened', { categoryId: id });
          }
          if (endState.answer !== original.answer) {
            this.sockets.emit('categoryAnswered', {
              categoryId: id, answer: endState.answer
            });
          }
        });
    })
    .then(res.json.bind(res))
    .then(next)
    .catch(next);
};
