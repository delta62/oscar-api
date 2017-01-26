const { validatorFactory } = require('./validator-factory');
const { ForbiddenError }   = require('restify');
const Joi                  = require('joi');

const schema = Joi.object().keys({
  answer: Joi.string().optional(),
  closed: Joi.date().optional().iso()
});

exports.categoryPatchValidator = function categoryPatchValidator(req) {
  if (!req.user.admin) {
    return Promise.reject(new ForbiddenError());
  }

  return validatorFactory(schema, req.body);
};
