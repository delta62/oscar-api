const config = require('config'),
  { userModelFactory } = require('../model/user'),
  { categoryModelFactory } = require('../model/category'),
  { responseModelFactory } = require('../model/response');

exports.get = function scoreGetHandler(req, res, next) {
  let User = userModelFactory(req.conn);
  let Category = categoryModelFactory(req.conn);
  let Response = responseModelFactory(req.conn);

  Promise.all([ User.find({ }), Category.find({ }), Response.find({ }) ])
    .then(calculateScores)
    .then(docs => res.json(docs))
    .then(() => next())
    .catch(err => next(err));
};

function calculateScores(promises) {
  let [ users, categories, responses ] = promises;

  return users.map(user => ({
    username: user.username,
    name: user.name,
    score: calculateUserScore(user.username, categories, responses)
  }));
}

function calculateUserScore(username, categories, responses) {
  return responses.reduce((acc, res) => {
    if (res.username !== username) {
      return acc;
    }

    let correctAnswer = categories.find(cat => cat.name === res.category).answer;
    let questionScore = res.value === correctAnswer
      ? config.get('score.correct')
      : config.get('score.incorrect');
    return acc + questionScore;
  }, 0);
}
