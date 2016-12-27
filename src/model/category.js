'use strict';

const mongoose = require('mongoose');

let schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  options: [ String ],
  answer: String,
  closed: Date
});

exports.Category = mongoose.model('Category', schema);
