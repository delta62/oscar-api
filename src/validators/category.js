const { BadRequestError, ForbiddenError } = require('restify');

exports.categoryPatchValidator = function categoryPatchValidator(req) {
  return new Promise((resolve, reject) => {
    if (!req.user.admin) {
      return reject(new ForbiddenError());
    }
    if (typeof req.body !== 'object' || !req.body) {
      return reject(new BadRequestError());
    }
    if (typeof req.body.answer !== 'string') {
      return reject(new BadRequestError());
    }

    if (typeof req.body.closed !== 'string') {
      return reject(new BadRequestError());
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(req.body.closed)) {
      return reject(new BadRequestError());
    }

    resolve({ answer: req.body.answer, closed: req.body.closed });
  });
};
