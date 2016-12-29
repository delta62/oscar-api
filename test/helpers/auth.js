const jwt = require('jsonwebtoken'),
  config = require('config');

exports.sign = function sign(username) {
  let payload = { username };
  payload.admin = config.get('auth.admins').includes(username);
  return jwt.sign(payload, config.get('auth.secret'));
};
