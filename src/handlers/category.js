const { modelFactory } = require('../model/model-factory'),
  {
    ForbiddenError,
    BadRequestError,
    NotFoundError,
    ConflictError
  } = require('restify'),
  { categorySchema, categoryModelFactory } = require('../model/category');

exports.browse = function categoryBrowseHandler(req, res, next) {
  let Category = modelFactory(req.conn, categorySchema, 'Category');
  Category.find({ })
    .then(cats => res.json(cats))
    .then(() => next())
    .catch(err => next(err));
};

exports.post = function categoryPostHandler(req, res, next) {
  if (!req.user.admin) {
    return next(new ForbiddenError());
  }

  if (req.body && req.body._id) delete req.body._id;

  let Category = categoryModelFactory(req.conn);
  Category.create(req.body)
    .then(() => res.send(201))
    .then(() => next())
    .catch(err => next(err));
}

exports.put = function categoryPutHandler(req, res, next) {
  if (!req.user.admin) {
    return next(new ForbiddenError());
  }

  let Category = modelFactory(req.conn, categorySchema, 'Category');
  let reqCat = new Category(req.body);
  reqCat.validate()
    .then(() => Category.findOne({ name: reqCat.name }))
    .then(cat => {
      if (!cat) throw new NotFoundError();
      return cat;
    })
    .then(cat => cat.set(reqCat.toJSON()))
    .then(cat => cat.save())
    .then(() => res.send(200))
    .then(() => next())
    .catch(err => next(err));
};
