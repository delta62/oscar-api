const mongoose = require('mongoose'),
  { modelFactory } = require('./model-factory');

exports.userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    match: /.{3,}/
  },
  username: {
    type: String,
    required: true,
    trim: true,
    match: /^\w{3,}$/,
    index: true,
    unique: true
  }
});

exports.userModelFactory = function userModelFactory(db) {
  return modelFactory(db, exports.userSchema, 'User');
};
