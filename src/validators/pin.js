const { validatorFactory } = require('./validator-factory');
const Joi                  = require('joi');

const schema = Joi.object().keys({
  username: Joi.string().email().lowercase(),
  pin: Joi.string().alphanum().length(6).uppercase()
});

function pinPostValidator(req) {
  return validatorFactory(schema, req.body);
}

module.exports = {
  pinPostValidator: pinPostValidator
};
