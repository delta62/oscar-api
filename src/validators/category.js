const { validatorFactory } = require('./validator-factory');
const { ForbiddenError }   = require('restify');
const Joi                  = require('joi');

const schema = Joi.object().keys({
  answer: Joi.string().optional(),
  closed: Joi.boolean().optional()
});

exports.categoryPatchValidator = function categoryPatchValidator(req) {
  if (!req.user.admin) {
    return Promise.reject(new ForbiddenError());
  }

  return validatorFactory(schema, req.body)
    .then(model => ({
      closed: model.closed,
      answer: model.answer || null
    }));
};
