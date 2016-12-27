const mongoose = require('mongoose');

let schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  options: {
    type: [ String ],
    required: true
  },
  answer: String,
  closed: Date
});

exports.Category = mongoose.model('Category', schema);
