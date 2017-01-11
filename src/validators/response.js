const { validatorFactory } = require('./validator-factory');
const Joi                  = require('joi');

const schema = Joi.object().keys({
  value: Joi.string()
});

exports.responseValidatorFactory = function responseValidatorFactory(req) {
  return validatorFactory(schema, req.body);
};
