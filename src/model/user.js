const mongoose         = require('mongoose');
const config           = require('config');
const { modelFactory } = require('./model-factory');

let userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    match: /.{3,}/
  },
  email: {
    type: String,
    required: true,
    trim: true,
    match: /^.+@.+\..+$/,
    index: true,
    unique: true
  }
});

userSchema.virtual('admin').get(function getUserIsAdmin() {
  return config.get('auth.admins').includes(this.email);
});

exports.userModelFactory = function userModelFactory(db) {
  return modelFactory(db, userSchema, 'User');
};
