const jwt    = require('jsonwebtoken');
const config = require('config');

exports.signToken = function signToken(user) {
  let token = {
    admin: user.admin,
    email: user.email,
    name: user.name,
    _id: user._id
  };

  return new Promise((resolve, reject) => {
    jwt.sign(token, config.get('auth.secret'), { }, (err, token) => {
      if (err) return reject(err);
      resolve(token);
    });
  });
};
