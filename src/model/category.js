'use strict';

const mongoose = require('mongoose');

let schema = new mongoose.Schema({
  name: String,
  options: [ String ],
  closed: Date
});

exports.Category = mongoose.model('Category', schema);
