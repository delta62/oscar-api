const { scoreCalculator, userScoreCalculator } = require('../services/score');
const { ensureFound }                          = require('../util');

exports.scoreBrowseHandler = function scoreBrowseHandler(req, res, next) {
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

exports.scoreGetHandler = function scoreGetHandler(req, res, next) {
  Promise.resolve()
    .then(() => this.models.User.findById(req.params.id))
    .do(ensureFound)
    .then(user => Promise.all([
      Promise.resolve(user),
      this.models.Category.find({ }),
      this.models.Response.find({ })
    ]))
    .then(data => {
      let [ user, categories, responses ] = data;
      return userScoreCalculator(user.email, categories, responses);
    })
    .then(res.json.bind(res))
    .then(next)
    .catch(next);
};
