const mongoose = require('mongoose');

const parameterSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  type: {
    type: String,
    required: true,
    enum: ['STRING', 'ARRAY', 'BOOLEAN', 'NUMBER', 'TIMESTAMP' ],
    default: 'STRING',
  },
  required: {
    default: false,
    type: Boolean,
  }
}, { timestamps: false });

const eventSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  slug: {
    required: true,
    type: String
  },

  parameters: [parameterSchema],

});

exports.Event = mongoose.model('Event', eventSchema);
