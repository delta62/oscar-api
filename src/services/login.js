const jwt  = require('jsonwebtoken');
const config = require('config');

exports.signToken = function signToken(user) {
  let token = createToken(user);

  return new Promise((resolve, reject) => {
    jwt.sign(token, config.get('auth.secret'), { }, (err, token) => {
      if (err) return reject(err);
      resolve(token);
    });
  });
};

function createToken(user) {
  return {
    admin: user.admin,
    email: user.email
  };
}


