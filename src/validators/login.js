const { validatorFactory }  = require('./validator-factory');
const { UnauthorizedError } = require('restify');
const Joi = require('joi');

const schema = Joi.object().keys({
  username: Joi.string()
});

exports.loginValidator = function loginValidator(req) {
  return validatorFactory(schema, req.body)
  .catch(() => {
    throw new UnauthorizedError();
  });
};
