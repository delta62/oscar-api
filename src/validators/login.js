const { validatorFactory }  = require('./validator-factory');
const { UnauthorizedError } = require('restify');
const Joi                   = require('joi');

const schema = Joi.object().keys({
  email: Joi.string().email()
});

exports.loginValidator = function loginValidator(req) {
  return validatorFactory(schema, req.body)
    .catch(() => {
      throw new UnauthorizedError();
    });
};
