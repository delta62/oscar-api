const mongoose = require('mongoose'),
  { modelFactory } = require('./model-factory');

exports.responseSchema = new mongoose.Schema({
  choice: {
    type: String,
    required: true
  },
  responseTime: {
    type: Date,
    required: true
  }
});

exports.responseModelFactory = function responseModelFactory(db) {
  return modelFactory(db, exports.responseModelSchema, 'Response');
}
