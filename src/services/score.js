const config = require('config');

exports.scoreCalculator = function calculateScores(data) {
  let [ users, categories, responses ] = data;

  return users.map(user => ({
    username: user.username,
    name: user.name,
    score: calculateUserScore(user.username, categories, responses)
  }));
};

function calculateUserScore(username, categories, responses) {
  return responses.reduce((acc, res) => {
    if (res.username !== username) {
      return acc;
    }

    let category = categories
      .find(cat => cat._id.toString() === res.category.toString());
    let questionScore = res.value === category.answer
      ? config.get('score.correct')
      : config.get('score.incorrect');
    return acc + questionScore;
  }, 0);
}
