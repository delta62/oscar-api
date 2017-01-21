const jwt = require('jsonwebtoken'),
  config = require('config');

exports.sign = function sign(email) {
  let payload = { email };
  payload.admin = config.get('auth.admins').includes(email);
  return jwt.sign(payload, config.get('auth.secret'));
};
