'use strict';

const mongoose = require('mongoose');

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
