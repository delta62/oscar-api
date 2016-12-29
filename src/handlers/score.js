const config = require('config');
const  { userModelFactory } = require('../model/user');
const  { categoryModelFactory } = require('../model/category');
const  { responseModelFactory } = require('../model/response');

exports.get = function scoreGetHandler(req, res, next) {
  let User = userModelFactory(req.conn);
  let Category = categoryModelFactory(req.conn);
  let Response = responseModelFactory(req.conn);

  Promise.all([ User.find({ }), Category.find({ }), Response.find({ }) ])
    .then(calculateScores)
    .then(res.json.bind(res))
    .then(next)
    .catch(next);
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

    let category = categories.find(cat => cat.name === res.category);
    let questionScore = res.value === category.answer
      ? config.get('score.correct')
      : config.get('score.incorrect');
    return acc + questionScore;
  }, 0);
}
