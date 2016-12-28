const mongoose = require('mongoose'),
  { modelFactory } = require('./model-factory');

exports.responseSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

exports.responseModelFactory = function responseModelFactory(db) {
  return modelFactory(db, exports.responseSchema, 'Response');
};
