const config = require('config');

exports.scoreCalculator = function calculateScores(data) {
  let [ users, categories, responses ] = data;

  return users.map(user => ({
    username: user.username,
    name: user.name,
    score: calculateUserScore(user.username, categories, responses)
  }));
};

exports.userScoreCalculator = function userScoreCalculator(
  userId,
  categories,
  responses) {

  let scoredResponses = responses
    .filter(res => res.username === userId)
    .reduce((acc, res) => {
      let cat = categories.find(cat => {
        return cat._id.toString() === res.category.toString();
      });
      let catResponses = responses.filter(res => {
        return res.category.toString() === cat._id.toString();
      });
      acc[cat.name] = calculateDetailedUserScore(userId, cat, catResponses);
      return acc;
    }, { });

  let totalScore = Object.keys(scoredResponses).reduce((acc, key) => {
    return acc + scoredResponses[key].score;
  }, 0);

  return {
    totalScore,
    responses: scoredResponses
  };
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

function calculateDetailedUserScore(username, category, responses) {
  let userScore = { };
  let userResponse = responses.find(res => res.username === username);
  let isCorrect = userResponse.value === category.answer;
  let isFirstAnswer = responses
    .filter(res => res.username !== username)
    .every(res => res.updatedAt >= userResponse.updatedAt);

  if (isCorrect) {
    userScore.correct = config.get('score.correct');
    isFirstAnswer && (userScore.first = config.get('score.first'));
  } else {
    userScore.incorrect = config.get('score.incorrect');
  }
  userScore.score =
    (userScore.correct || 0) +
    (userScore.first || 0) +
    (userScore.incorrect || 0);
  return userScore;
}
