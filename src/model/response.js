const { Schema }       = require('mongoose');
const { modelFactory } = require('./model-factory');

const responseSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
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
  return modelFactory(db, responseSchema, 'Response');
};
