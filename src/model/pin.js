const { Schema }       = require('mongoose');
const { modelFactory } = require('./model-factory');

const schema = new Schema({
  email: {
    type: String,
    required: true
  },
  pin: {
    type: String,
    required: true
  },
  expires: {
    type: Date,
    // Valid for 5 minutes
    default: () => Date.now() + 1000 * 60 * 5
  }
});

function pinModelFactory(db) {
  return modelFactory(db, schema, 'Pin');
}

module.exports = {
  pinModelFactory: pinModelFactory
};
