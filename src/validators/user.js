const { validatorFactory } = require('./validator-factory');
const Joi                  = require('joi');

const schema = Joi.object().keys({
  name: Joi.string().min(3).regex(/^[a-z]+ [a-z]+$/i),
  username: Joi.string().min(3).token().lowercase()
});

exports.userPostValidator = function(req) {
  return validatorFactory(schema, req.body);
};
