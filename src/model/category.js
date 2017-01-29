const { BadRequestError } = require('restify');
const { Schema }          = require('mongoose');
const { modelFactory }    = require('./model-factory');
const { ensureFound }     = require('../util');

const schema = new Schema({
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
  responses: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Response' }]
  },
  answer: String,
  closed: Date
});

schema.set('toObject', { transform: (doc, ret) => {
  delete ret.responses;
  return ret;
} });

schema.statics.ensureValid = function ensureValid(id, option) {
  return Promise.resolve()
    .then(() => this.findById(id))
    .do(ensureFound)
    .then(doc => {
      if (!doc.options.includes(option)) throw new BadRequestError();
    });
};

exports.categoryModelFactory = function categoryModelFactory(db) {
  return modelFactory(db, schema, 'Category');
};
