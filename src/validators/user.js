const { validatorFactory } = require('./validator-factory');
const Joi                  = require('joi');

const schema = Joi.object().keys({
  name: Joi.string().min(3),
  email: Joi.string().email().lowercase()
});

exports.userPostValidator = function(req) {
  return validatorFactory(schema, req.body);
};
