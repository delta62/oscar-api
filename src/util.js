const { NotFoundError } = require('restify');

exports.ensureFound = function ensureFound(obj, err) {
  if (!obj) {
    err = err || new NotFoundError();
    throw err;
  }
};
