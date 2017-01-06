const Joi = require('joi');

const opts = {
  presence:     'required',
  stripUnknown: true
};

exports.validatorFactory = function validatorFactory(schema, obj) {
  return new Promise((resolve, reject) => {
    Joi.validate(obj, schema, opts, (err, model) => {
      if (err) return reject(err);
      resolve(model);
    });
  });
};
