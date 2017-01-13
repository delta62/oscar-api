const { scoreCalculator } = require('../services/score');

exports.get = function scoreGetHandler(req, res, next) {
  Promise.all([
    this.models.User.find({ }),
    this.models.Category.find({ }),
    this.models.Response.find({ })
  ])
    .then(scoreCalculator)
    .then(res.json.bind(res))
    .then(next)
    .catch(next);
};
