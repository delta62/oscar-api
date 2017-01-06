const { userModelFactory }     = require('../model/user');
const { categoryModelFactory } = require('../model/category');
const { responseModelFactory } = require('../model/response');
const { scoreCalculator }      = require('../services/score');

exports.get = function scoreGetHandler(req, res, next) {
  let User = userModelFactory(req.conn);
  let Category = categoryModelFactory(req.conn);
  let Response = responseModelFactory(req.conn);

  Promise.all([ User.find({ }), Category.find({ }), Response.find({ }) ])
    .then(scoreCalculator)
    .then(res.json.bind(res))
    .then(next)
    .catch(next);
};
