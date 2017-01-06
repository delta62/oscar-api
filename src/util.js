const { NotFoundError } = require('restify');

exports.ensureFound = function ensureFound(obj) {
  if (!obj) throw new NotFoundError();
};
